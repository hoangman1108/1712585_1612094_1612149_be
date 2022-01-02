import {
  Body, Controller, Post, Route, Tags, Security, Request,
} from 'tsoa';
import { EnumMail } from '../interfaces/sendMail.interface';
import { IChangePasswordRequest, ILoginRequest, ITokenResponse } from '../interfaces/token.interface';
import { IUserRequest } from '../interfaces/user.interface';
import { ProvideSingleton, inject } from '../inversify/ioc';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { UserCollection } from '../models/user.model';
import AuthService from '../services/auth.service';
import EmailService from '../services/email.service';
import { changePasswordSchema, registerSchema } from '../validations/auth.validate';

@Tags('Auth')
@Route('/auth')
@ProvideSingleton(AuthController)
export class AuthController extends Controller {
  constructor(@inject(AuthService) private authService: AuthService, @inject(EmailService) private emailService: EmailService) {
    super();
  }

  @Post('/login')
  async login(@Body() data: ILoginRequest): Promise<ITokenResponse> {
    return this.authService.login(data.username, data.password);
  }

  @Post('/signup')
  async register(@Body() data: IUserRequest): Promise<{ message: string }> {
    validateMiddleware(registerSchema, data);
    const message = await this.authService.register(data);
    await this.emailService.sendEmail(data.email, {
      subject: 'Xác nhận tài khoản',
      title: 'Xác nhận tài khoản',
      body: 'body',
      type: EnumMail.ActiveAccount,
      info: {
        url: 'http://localhost/confirm-account',
        name: data.name,
      } as any,
    });
    return { message };
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() data:{ email: string }): Promise<{ message: string }> {
    const account = await UserCollection.findOne({
      email: data.email,
    });
    if (!account) {
      return {
        message: 'EMAIL_NOT_FOUND',
      };
    }
    await this.emailService.sendEmail(data.email, {
      subject: 'Reset Mật khẩu',
      title: 'Reset Mật khẩu',
      body: 'body',
      type: EnumMail.ResetPassword,
      info: {
        url: 'http://localhost/reset-password-account',
        name: account.name,
      } as any,
    });
    return { message: 'CHECK_YOUR_EMAIL_TO_RESET_PASSWORD' };
  }

  @Post('/change-password')
  @Security('oauth2')
  async changePassword(@Body() data: IChangePasswordRequest, @Request() request: any): Promise<{ message: string }> {
    validateMiddleware(changePasswordSchema, data);
    const message = await this.authService.changePassword({
      ...data,
      userId: request.user.userId,
    });

    return {
      message,
    };
  }

  @Post('/verify-account/:accountId')
  @Security('oauth2')
  async verifyAccount(accountId: string):Promise<{ message: string }> {
    const message = await this.authService.verifyAccount(accountId);
    return {
      message,
    };
  }
}
