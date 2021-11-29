export interface IAssignmentCreateRequest {
  score: number;
  name: string;
  classId: string;
}

export interface IFindAssignmentRequest {
  classId?: string;
  name?: string;
}

export interface IAssignmentCreateServiceRequest {
  score: number;
  name: string;
  classId: string;
  teacherId: string;
}

export interface IAssignmentUpdateRequest {
  id?: string;
  score?: number;
  name?: string;
}
export interface IAssignmentUpdateServiceRequest {
  id?: string;
  score?: number;
  name?: string;
  // classId?: string;
  teacherId: string;
}

export interface IAssignmentResponse {
  id?: string;
  score: number;
  name: string;
  // classId: string;
  teacherId: string;
}
