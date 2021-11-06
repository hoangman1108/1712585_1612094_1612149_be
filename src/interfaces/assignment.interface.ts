export interface IAssignmentCreateRequest {
  percent: number;
  name: string;
  classId: string;
  teacherId: string;
}

export interface IAssignmentUpdateRequest {
  id?: string;
  percent?: number;
  name?: string;
  classId?: string;
  teacherId?: string;
}

export interface IAssignmentResponse {
  id: string;
  percent: number;
  name: string;
  classId: string;
  teacherId: string;
}
