export interface IComment {
  userId: string;
  name: string;
  role: string;
  comment: string;
}

export enum MarkEnum {
  ACCEPT = 'accept',
  REJECT = 'reject',
  PROCESSING = 'processing',
}

export interface IGradeViewRequest {
  classId: string;
  studentId: string;
  Mssv: string;
  composition: string;
  current: number;
  expect: number;
  explanation: string;
  comments?: IComment[];
  mark: MarkEnum;
}
export interface IGradeViewResponse {
  id?: string;
  classId: string;
  studentId: string;
  Mssv: string;
  composition: string;
  current: number;
  expect: number;
  explanation: string;
  comments?: IComment[];
  mark: MarkEnum;
}
export interface IUpdateMarkRequest {
  gradeViewId: string;
  mark: MarkEnum;
}
