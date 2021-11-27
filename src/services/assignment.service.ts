import httpStatus from 'http-status';
import {
  IAssignmentCreateServiceRequest, IAssignmentResponse, IAssignmentUpdateServiceRequest, IFindAssignmentRequest,
} from '../interfaces/assignment.interface';
import { ProvideSingleton } from '../inversify/ioc';
import { AssignmentCollection } from '../models/assignment.model';
import { ClassCollection } from '../models/class.model';
import { UserCollection } from '../models/user.model';
import { ApiError } from '../utils';

@ProvideSingleton(AssignmentService)
export default class AssignmentService {
  async list(data: IFindAssignmentRequest): Promise<IAssignmentResponse[]> {
    const find: any = {};
    if (data.classId) {
      find.classId = data.classId;
    }
    if (data.classId && !data.name) {
      const assignments = await AssignmentCollection.find(find);
      return assignments;
    }
    const assignments = await AssignmentCollection.find({
      ...find,
      $text: {
        $search: data.name,
      },
    });
    return assignments;
  }

  async create(data: IAssignmentCreateServiceRequest): Promise<IAssignmentResponse> {
    const user = await UserCollection.findById(data.teacherId);
    if (user && user.role === 'student') {
      throw new ApiError(httpStatus.FORBIDDEN, 'USER_CANNOT_CREATE_ASSIGNMENT');
    }

    const findClass: any = await ClassCollection.findById(data.classId).populate({
      path: 'teachers',
      match: {
        _id: data.teacherId,
      },
    });

    if (!findClass) {
      throw new ApiError(httpStatus.NOT_FOUND, 'CLASS_ID_NOT_FOUND');
    }

    if (!findClass.teachers.length) {
      throw new ApiError(httpStatus.NOT_FOUND, 'TEACHER_NOT_FOUND_IN_CLASS');
    }

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
    const user = await UserCollection.findById(data.teacherId);
    if (user && user.role === 'student') {
      throw new ApiError(httpStatus.FORBIDDEN, 'USER_CANNOT_UPDATE_ASSIGNMENT');
    }

    const findClass: any = await ClassCollection.findById(data.classId).populate({
      path: 'teachers',
      match: {
        _id: data.teacherId,
      },
    });

    if (!findClass) {
      throw new ApiError(httpStatus.NOT_FOUND, 'CLASS_ID_NOT_FOUND');
    }

    if (!findClass.teachers.length) {
      throw new ApiError(httpStatus.NOT_FOUND, 'TEACHER_NOT_FOUND_IN_CLASS');
    }
    const assignment: IAssignmentResponse | null = await AssignmentCollection.findByIdAndUpdate(data.id, data, { new: true });
    if (!assignment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'ASSIGNMENT_NOT_FOUND');
    }
    return assignment;
  }

  async delete(assignmentId: string): Promise<string> {
    const deleted = await AssignmentCollection.deleteOne({ _id: assignmentId });

    if (deleted.ok && deleted.n) {
      return 'DELETED';
    }
    throw new ApiError(httpStatus.BAD_REQUEST, 'DELETE_CLASS_FAIL');
  }
}
