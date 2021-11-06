export interface IGradeCreateRequest {
  studentId: string;
  assignmentId: string;
  score: number;
  report: string;
}

export interface IGradeUpdateRequest {
  id?: string;
  studentId?: string;
  assignmentId?: string;
  score?: number;
  report?: string;
}

export interface IGradeResponse {
  id: string;
  studentId: string;
  assignmentId: string;
  score: number;
  report: string;
}
