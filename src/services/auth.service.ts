import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import { IChangePasswordRequest, ITokenResponse } from '../interfaces/token.interface';
import { IUserResponse, IUserRequest } from '../interfaces/user.interface';
import { ProvideSingleton } from '../inversify/ioc';
import { TokenCollection } from '../models/token.model';
import { UserAttributes, UserCollection } from '../models/user.model';
import { ApiError } from '../utils';
import authUtils from '../utils/auth';

@ProvideSingleton(AuthService)
export default class AuthService {
  async login(username: string, password: string): Promise<ITokenResponse> {
    const findUser: UserAttributes | null = await UserCollection.findOne({
      $or: [
        { mssv: username },
        { email: username },
        { phone: username },
      ],
    });

    if (!findUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }

    const isMatch = await findUser.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'PASSWORD_NOT_MATCH');
    }

    const newAccessToken = await authUtils.generateAccessToken({
      userId: findUser.id,
      username,
    });
    const newRefreshToken = await authUtils.generateRefreshToken({
      userId: findUser.id,
      username,
    });

    const authToken = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      userId: findUser.id,
    };

    const token: ITokenResponse = await TokenCollection.create(authToken);

    return token;
  }

  async register(data: IUserRequest): Promise<string> {
    const user: IUserResponse | null = await UserCollection.create(data);
    if (!user) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'USER_CREATE_ERROR');
    }
    return 'CREATE_USER_SUCCESS';
  }

  async changePassword(data: IChangePasswordRequest): Promise<string> {
    const findUser = await UserCollection.findById(data.userId);
    if (!findUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }

    const compare = await findUser.comparePassword(data.oldPassword);
    if (!compare) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'PASSWORD_NOT_MATCH');
    }
    const newPassword = await bcrypt.hash(data.newPassword, findUser.passwordSalt || '');
    const updated = await findUser.update({
      password: newPassword,
    });
    if (updated.n && updated.ok) {
      return 'PASSWORD_CHANGED';
    }
    return 'CHANGE_PASSWORD_FAIL';
  }
}
