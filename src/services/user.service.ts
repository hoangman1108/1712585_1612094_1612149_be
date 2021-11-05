import httpStatus from 'http-status';
import { IUserResponse, IUserUpdateRequest } from '../interfaces/user.interface';
import { ProvideSingleton } from '../inversify/ioc';
import { UserCollection } from '../models/user.model';
import { ApiError } from '../utils';

@ProvideSingleton(UserService)
export default class UserService {
  async list(): Promise<IUserResponse[]> {
    const users: IUserResponse[] = await UserCollection.find();
    return users;
  }

  async get(id: string): Promise<IUserResponse> {
    const user: IUserResponse | null = await UserCollection.findById(id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }
    return user;
  }

  async update(data: IUserUpdateRequest): Promise<IUserResponse> {
    const user: IUserResponse | null = await UserCollection.findByIdAndUpdate(data.id, data);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }
    return user;
  }

  async delete(id: string): Promise<IUserResponse> {
    const user: IUserResponse | null = await UserCollection.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }
    return user;
  }
}
