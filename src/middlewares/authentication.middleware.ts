/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-promise-reject-errors */
import * as express from 'express';
import httpStatus from 'http-status';
import { Error } from 'mongoose';
import passport, { PassportStatic } from 'passport';
import {
  ExtractJwt, Strategy, StrategyOptions, VerifiedCallback,
} from 'passport-jwt';
import { TokenCollection } from '../models/token.model';
import { UserAttributes, UserCollection } from '../models/user.model';
import { ApiError } from '../utils';
import authUtils from '../utils/auth';

interface IJwtPayload {
  user?: UserAttributes;
  iat?: Date;
}
// eslint-disable-next-line @typescript-eslint/no-shadow
export const authenticateUser = (passport: PassportStatic) => {
  const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('authorization'),
    secretOrKey: process.env.JWT_SECRET || 'secret',
  };
  passport.use(new Strategy(options, async (jwtPayload: IJwtPayload, done: VerifiedCallback) => {
    // const result = await <IUserResponse>_userRepository.getUserById(jwtPayload.user._id);
    const result = await UserCollection.findById(jwtPayload.user?._id);
    if (result instanceof Error) return done(result, false);
    if (!result) {
      return done(null, false);
    }
    return done(null, result, { issuedAt: jwtPayload.iat });
  }));
};

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
): Promise<any> {
  if (securityName === 'oauth2') {
    const token = request.body.token || request.query.token || request.headers.authorization;
    return authUtils.verifyJWT(token || '').then(async (result: any) => {
      const itoken = await TokenCollection.findOne({ userId: result.userId });
      if (!itoken) {
        throw new ApiError(httpStatus.FORBIDDEN, 'ACCOUNT_ACCESS_DENIED');
      }
      return result;
    });
  }
  if (securityName === 'admin') {
    const token = request.body.token || request.query.token || request.headers.authorization;
    return authUtils.verifyJWT(token || '').then(async (result: any) => {
      const itoken = await TokenCollection.findOne({ userId: result.userId });
      if (!itoken) {
        throw new ApiError(httpStatus.FORBIDDEN, 'ACCOUNT_ACCESS_DENIED');
      }
      const checkRole = await UserCollection.findById(result.userId).lean();
      if (checkRole?.role !== 'admin') {
        throw new ApiError(httpStatus.FORBIDDEN, 'ACCOUNT_NEED_ROLE_ADMIN');
      }
      return result;
    });
  }
}
