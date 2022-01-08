export interface IUserRequest {
  name: string;
  dob?: string;
  role: string;
  email: string;
  mssv?: string;
  phone?: string;
  password: string;
  facebook?: string;
  google?: string;
}
export interface IUpdateAccount {
  id: string;
  name?: string;
  dob?: string;
  role?: string;
  email?: string;
  mssv?: string;
  phone?: string;
  password: string;
  facebook?: string;
  google?: string;
}

export interface IUpdateClass {
  id: string;
  name?: string;
  dob?: string;
  role?: string;
  email?: string;
  mssv?: string;
  phone?: string;
  password: string;
  facebook?: string;
  google?: string;
}

export interface IUserUpdateRequest {
  id?: string;
  name?: string;
  dob?: string;
  mssv?: string;
  role?: string;
  phone?: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  dob?: string;
  role: string;
  email: string;
  status?: string;
  mssv?: string;
  phone?: string;
  password: string;
  passwordSalt?: string;
  facebook?: string;
  google?: string;
}
