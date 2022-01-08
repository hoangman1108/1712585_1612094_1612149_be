import httpStatus from 'http-status';
import {
  Tags, Route, Controller, Put, Delete, Body, Get, Security, Request, Post,
} from 'tsoa';
import {
  IUpdateAccount, IUserRequest, IUserResponse, IUserUpdateRequest,
} from '../interfaces/user.interface';
import { ProvideSingleton, inject } from '../inversify/ioc';
import { ClassCollection } from '../models/class.model';
import { StatusEnum, UserCollection } from '../models/user.model';
import UserService from '../services/user.service';
import { ApiError } from '../utils';

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

  @Get('/me')
  @Security('oauth2')
  async getMe(@Request() request: any): Promise<IUserResponse> {
    const { user: { userId } } = request;
    return this.userService.get(userId);
  }

  @Get('/{userId}')
  @Security('oauth2')
  async getUser(userId: string): Promise<IUserResponse> {
    return this.userService.get(userId);
  }

  @Get('/role/{userRole}')
  @Security('oauth2')
  async findUserByRole(userRole: string): Promise<IUserResponse[]> {
    return this.userService.findUserByRole(userRole);
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

  @Post('/admin/create')
  @Security('admin')
  async createAdmin(@Body() data: IUserRequest): Promise<any> {
    const find = await UserCollection.findOne({
      email: data.email,
    }).lean();
    if (find) {
      throw new ApiError(httpStatus.FOUND, 'EMAIL_IS_EXISTS');
    }
    const response = await UserCollection.create({ ...data, role: 'admin', status: StatusEnum.ACTIVE });
    return response;
  }

  @Get('/admin/all-user')
  @Security('admin')
  async getAllUserForAdmin(): Promise<any> {
    const response = await UserCollection.find({
      $or: [
        { role: 'teacher' },
        { role: 'student' },
      ],
    });
    return response;
  }

  @Post('/admin/update-user')
  @Security('admin')
  async updateAccountUser(@Body() data: IUpdateAccount): Promise<any> {
    try {
      await UserCollection.updateOne({
        _id: data.id,
      }, data, { new: true });
      return {
        message: 'UPDATE_ACCOUNT_USER_SUCCESS',
      };
    } catch {
      return {
        message: 'UPDATE_ACCOUNT_USER_FAIL',
      };
    }
  }

  @Post('/admin/delete')
  @Security('admin')
  async deleteAccountAdmin(@Body() data: { email: string }): Promise<any> {
    try {
      await UserCollection.deleteOne({
        email: data.email,
      });
      return {
        message: 'DELETE_ACCOUNT_ADMIN_SUCCESS',
      };
    } catch {
      return {
        message: 'DELETE_ACCOUNT_ADMIN_FAIL',
      };
    }
  }

  @Post('/admin/delete-user/{userId}')
  @Security('admin')
  async deleteAccountUser(userId: string): Promise<any> {
    try {
      await UserCollection.findByIdAndDelete(userId);
      return {
        message: 'USER_DELETED',
      };
    } catch {
      return {
        message: 'DELETE_USER_FAIL',
      };
    }
  }

  @Post('/admin/delete-class/{classId}')
  @Security('admin')
  async deleteClassByAdmin(classId: string): Promise<any> {
    try {
      await ClassCollection.findByIdAndDelete(classId);
      return {
        message: 'CLASS_DELETED',
      };
    } catch {
      return {
        message: 'DELETE_CLASS_FAIL',
      };
    }
  }
}
