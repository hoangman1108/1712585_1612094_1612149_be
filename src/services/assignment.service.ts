import httpStatus from 'http-status';
import { IAssignmentCreateRequest, IAssignmentResponse, IAssignmentUpdateRequest } from '../interfaces/assignment.interface';
import { ProvideSingleton } from '../inversify/ioc';
import { AssignmentCollection } from '../models/assignment.model';
import { ApiError } from '../utils';

@ProvideSingleton(AssignmentService)
export default class AssignmentService {
  async list(): Promise<IAssignmentResponse[]> {
    const assignments = await AssignmentCollection.find();
    return assignments;
  }

  async create(data: IAssignmentCreateRequest): Promise<IAssignmentResponse> {
    const assignment = await AssignmentCollection.create(data);
    return assignment;
  }

  async detail(id: string): Promise<IAssignmentResponse> {
    const assignment: IAssignmentResponse | null = await AssignmentCollection.findById(id);

    if (!assignment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'ASSIGNMENT_NOT_FOUND');
    }
    return assignment;
  }

  async update(data: IAssignmentUpdateRequest): Promise<IAssignmentResponse> {
    const assignment: IAssignmentResponse | null = await AssignmentCollection.findByIdAndUpdate(data.id, data);

    if (!assignment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'ASSIGNMENT_NOT_FOUND');
    }
    return assignment;
  }

  async delete(id: string): Promise<string> {
    const deleted = await AssignmentCollection.deleteOne({ _id: id });

    if (deleted.ok && deleted.n) {
      return 'DELETED';
    }
    throw new ApiError(httpStatus.BAD_REQUEST, 'DELETE_CLASS_FAIL');
  }
}
