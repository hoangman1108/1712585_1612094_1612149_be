import {
  Tags, Route, Controller, Put, Delete, Body, Get, Security,
} from 'tsoa';
import { IUserResponse, IUserUpdateRequest } from '../interfaces/user.interface';
import { ProvideSingleton, inject } from '../inversify/ioc';
import UserService from '../services/user.service';

@Route('/users')
@Tags('User')
@ProvideSingleton(UserController)
export class UserController extends Controller {
  constructor(@inject(UserService) private userService: UserService) {
    super();
  }

  @Get()
  @Security('oauth2')
  async getUsers(): Promise<IUserResponse[]> {
    return this.userService.list();
  }

  @Get('/{userId}')
  @Security('oauth2')
  async getUser(userId: string): Promise<IUserResponse> {
    return this.userService.get(userId);
  }

  @Put('/{id}')
  @Security('oauth2')
  async updateUser(id: string, @Body() data: IUserUpdateRequest): Promise<IUserResponse> {
    return this.userService.update({
      ...data,
      id,
    });
  }

  @Delete('/{id}')
  @Security('oauth2')
  async deleteUser(id: string): Promise<IUserResponse> {
    return this.userService.delete(id);
  }
}
