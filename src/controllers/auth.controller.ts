import {
  Body, Controller, Post, Route, Tags, Security, Request, Query,
} from 'tsoa';
import bcrypt from 'bcrypt';
import { EnumMail } from '../interfaces/sendMail.interface';
import { ILoginRequest, ITokenResponse } from '../interfaces/token.interface';
import { IUserRequest } from '../interfaces/user.interface';
import { ProvideSingleton, inject } from '../inversify/ioc';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { UserCollection } from '../models/user.model';
import AuthService from '../services/auth.service';
import EmailService from '../services/email.service';
import { registerSchema } from '../validations/auth.validate';

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

  @Post('/login-admin')
  async loginAdmin(@Body() data: ILoginRequest): Promise<ITokenResponse> {
    return this.authService.loginAdmin(data.username, data.password);
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

  @Post('/reset-password')
  async resetPassword(@Query() userId: string, @Body() data:{ newPassword: string }): Promise<{ message: string }> {
    const account = await UserCollection.findById(userId);
    if (!account) {
      return {
        message: 'USER_NOT_FOUND',
      };
    }

    const newPassword = await bcrypt.hash(data.newPassword, account.passwordSalt || '');
    await account.updateOne({
      password: newPassword,
    });
    account.save();
    return { message: 'RESET_PASSWORD_SUCCESS' };
  }

  @Post('/verify-account/:accountId')
  async verifyAccount(accountId: string):Promise<{ message: string }> {
    const message = await this.authService.verifyAccount(accountId);
    return {
      message,
    };
  }
}
