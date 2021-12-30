export interface ISendMail {
  subject: string;
  title: string;
  body: string;
  type: EnumMail;
  info: string;
}

export interface IMail {
  subject: string;
  title: string;
  body: string;
  to: string;
  type: EnumMail;
  info: string;
}

export enum EnumMail {
  BaSicContentCenter = 'basic-content-center',
  BasicContentLeft = 'basic-content-left',
  ActiveAccount = 'active-account',
  KycApproved = 'kyc-approved',
  KycSpending = 'kyc-spending',
  KycSubmission = 'kyc-submission',
  NewsLetter = 'newsletter',
  PasswordRequest = 'password-request',
  PasswordResetSuccess = 'password-reset-success',
  Wellcome = 'wellcome',
  InviteJoinClass = 'invite-join-class',
}
