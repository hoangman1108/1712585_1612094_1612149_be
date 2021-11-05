/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-promise-reject-errors */
import * as express from 'express';

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
): Promise<any> {
  if (securityName === 'oauth2') {
    const token = request.body.token || request.query.token || request.headers.authorization;
    return {};
  }
}
