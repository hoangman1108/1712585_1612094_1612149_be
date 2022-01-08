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

  async findUserByRole(userRole: string): Promise<IUserResponse[]> {
    const users: IUserResponse[] | null = await UserCollection.find({ role: userRole });
    if (!users) {
      throw new ApiError(httpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }
    return users;
  }

  async update(data: IUserUpdateRequest): Promise<IUserResponse | any> {
    if (data?.mssv) {
      const find = await UserCollection.findOne({
        mssv: data.mssv,
      }).lean();
      if (find) {
        return {
          message: 'MSSV_IS_EXISTS',
        };
      }
    }
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
