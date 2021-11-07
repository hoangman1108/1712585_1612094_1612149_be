/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-promise-reject-errors */
import * as express from 'express';
import httpStatus from 'http-status';
import { TokenCollection } from '../models/token.model';
import { ApiError } from '../utils';
import authUtils from '../utils/auth';

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
}
