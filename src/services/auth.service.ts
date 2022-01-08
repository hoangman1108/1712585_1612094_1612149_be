import httpStatus from 'http-status';
import { ITokenResponse } from '../interfaces/token.interface';
import { IUserResponse, IUserRequest } from '../interfaces/user.interface';
import { ProvideSingleton } from '../inversify/ioc';
import { TokenCollection } from '../models/token.model';
import { StatusEnum, UserAttributes, UserCollection } from '../models/user.model';
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
    if (findUser.count === 5) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'ACCOUNT_IS_LOCKED');
    }

    const isMatch = await findUser.comparePassword(password);
    if (!isMatch) {
      findUser.count = Number(findUser.count) + 1;
      findUser.save();
      throw new ApiError(httpStatus.UNAUTHORIZED, 'PASSWORD_NOT_MATCH');
    }
    if (findUser.status === StatusEnum.UNACTIVE) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'ACCOUNT_UN_ACTIVE');
    }
    findUser.count = 0;
    findUser.save();
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

    const token: any = await TokenCollection.create(authToken);

    token.role = findUser.role;

    return {
      ...token.toJSON(),
      role: findUser.role,
    };
  }

  async loginAdmin(username: string, password: string): Promise<ITokenResponse> {
    const findUser: UserAttributes | null = await UserCollection.findOne({
      $or: [
        { email: username },
      ],
    });

    if (!findUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }

    if (findUser.role !== 'admin') {
      throw new ApiError(httpStatus.FORBIDDEN, 'NEED_USE_ACCOUNT_ROLE_ADMIN');
    }

    const isMatch = await findUser.comparePassword(password);
    if (!isMatch) {
      findUser.count = Number(findUser.count) + 1;
      findUser.save();
      throw new ApiError(httpStatus.UNAUTHORIZED, 'PASSWORD_NOT_MATCH');
    }
    if (findUser.status === StatusEnum.UNACTIVE) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'ACCOUNT_UN_ACTIVE');
    }
    findUser.count = 0;
    findUser.save();
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

    const token: any = await TokenCollection.create(authToken);

    token.role = findUser.role;

    return {
      ...token.toJSON(),
      role: findUser.role,
    };
  }

  async register(data: IUserRequest): Promise<string> {
    // const checkMssv = await UserCollection.findOne({
    //   mssv: data.mssv,
    // });
    // if (checkMssv) {
    //   throw new ApiError(httpStatus.FOUND, 'MSSV_IS_EXISTS');
    // }
    const user: IUserResponse | null = await UserCollection.create(data);
    if (!user) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'USER_CREATE_ERROR');
    }
    return 'CREATE_USER_SUCCESS';
  }

  async verifyAccount(userId: string): Promise<any> {
    const user: UserAttributes | null = await UserCollection.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'ID_USER_NOT_FOUND');
    }
    user.status = StatusEnum.ACTIVE;
    user.save();
    return 'VERIFY_SUCCESS';
  }
}
