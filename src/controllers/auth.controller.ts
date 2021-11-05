import {
  Body, Controller, Post, Route, Tags, Security, Request,
} from 'tsoa';
import { IChangePasswordRequest, ILoginRequest, ITokenResponse } from '../interfaces/token.interface';
import { IUserRequest } from '../interfaces/user.interface';
import { ProvideSingleton, inject } from '../inversify/ioc';
import { validateMiddleware } from '../middlewares/validate.middleware';
import AuthService from '../services/auth.service';
import { changePasswordSchema, registerSchema } from '../validations/auth.validate';

@Tags('Auth')
@Route('/auth')
@ProvideSingleton(AuthController)
export class AuthController extends Controller {
  constructor(@inject(AuthService) private authService: AuthService) {
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
    return { message };
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
}
