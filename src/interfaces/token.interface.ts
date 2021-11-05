export interface ITokenCreateRequest {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export interface ITokenUpdateRequest {
  id?: string;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
}

export interface ITokenResponse{
  id: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IChangePasswordRequest {
  userId?: string;
  oldPassword: string;
  newPassword: string;
}
