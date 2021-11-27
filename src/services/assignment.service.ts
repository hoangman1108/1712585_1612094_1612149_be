import httpStatus from 'http-status';
import {
  IAssignmentCreateServiceRequest, IAssignmentResponse, IAssignmentUpdateServiceRequest, IFindAssignmentRequest,
} from '../interfaces/assignment.interface';
import { ProvideSingleton } from '../inversify/ioc';
import { AssignmentCollection } from '../models/assignment.model';
import { ApiError } from '../utils';

@ProvideSingleton(AssignmentService)
export default class AssignmentService {
  async list(data: IFindAssignmentRequest): Promise<IAssignmentResponse[]> {
    const find: any = {};
    if (data.classId) {
      find.classId = data.classId;
    }
    if (data.name) {
      find.name = data.name;
    }
    const assignments = await AssignmentCollection.find(data);
    return assignments;
  }

  async create(data: IAssignmentCreateServiceRequest): Promise<IAssignmentResponse> {
    const find = await AssignmentCollection.findOne({ name: data.name, classId: data.classId });
    if (find) {
      throw new ApiError(httpStatus.FOUND, 'NAME_ASSIGNMENT_FOUND_IN_CLASS');
    }
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

  async update(data: IAssignmentUpdateServiceRequest): Promise<IAssignmentResponse> {
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
