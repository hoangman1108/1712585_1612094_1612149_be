import jwt, { verify } from 'jsonwebtoken';

const jwtConfig = {
  accessTokenSecret: process.env.JWT_ACCESSTOKEN_SECRET || '2155B3A7378B76C15A33932859D6F',
  refreshTokenSecret: process.env.JWT_REFRESHTOKEN_SECRET || '11EC248BF9C2CF4AEAC958724EB4B',
  issuer: process.env.JWT_ISSUER || '6AC3E9A78E316',
  audience: process.env.JWT_AUDIENCE || 'B55EF41518AED',
};

const authUtils = {
  async generateAccessToken(user: any) {
    return jwt.sign(user, jwtConfig.accessTokenSecret, {
      subject: user.id || '',
      audience: jwtConfig.audience,
      issuer: jwtConfig.issuer,
      expiresIn: '2h',
    });
  },
  async generateRefreshToken(user: any) {
    return jwt.sign(user, jwtConfig.refreshTokenSecret, {
      subject: user.id || '',
      audience: jwtConfig.audience,
      issuer: jwtConfig.issuer,
      expiresIn: '1d',
    });
  },
  async verifyJWT(token: string) {
    const reToken = token.replace('Bearer', '').trim();
    return verify(reToken, jwtConfig.accessTokenSecret, (err: any, user: any) => {
      if (err) {
        throw err;
      }
      return user;
    });
  },
};

export default authUtils;
