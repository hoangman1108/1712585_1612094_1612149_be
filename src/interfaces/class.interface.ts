export interface IClass {
  name: string;
  teachers?: string[];
  students?: string[];
  codeJoin: string;
}

export interface IClassAddUser {
  classId: string;
  userId: string;
}
