import httpStatus from 'http-status';
import { IGradeCreateRequest, IGradeResponse, IGradeUpdateRequest } from '../interfaces/grade.interface';
import { ProvideSingleton } from '../inversify/ioc';
import { GradeCollection } from '../models/grade.model';
import { ApiError } from '../utils';

@ProvideSingleton(GradeService)
export default class GradeService {
  async list(): Promise<IGradeResponse[]> {
    const grades = await GradeCollection.find();
    return grades;
  }

  async create(data: IGradeCreateRequest): Promise<IGradeResponse> {
    const grade = await GradeCollection.create(data);
    return grade;
  }

  async detail(id: string): Promise<IGradeResponse> {
    const grade: IGradeResponse | null = await GradeCollection.findById(id);

    if (!grade) {
      throw new ApiError(httpStatus.NOT_FOUND, 'ASSIGNMENT_NOT_FOUND');
    }
    return grade;
  }

  async update(data: IGradeUpdateRequest): Promise<IGradeResponse> {
    const grade: IGradeResponse | null = await GradeCollection.findByIdAndUpdate(data.id, data, { new: true });

    if (!grade) {
      throw new ApiError(httpStatus.NOT_FOUND, 'ASSIGNMENT_NOT_FOUND');
    }
    return grade;
  }

  async delete(id: string): Promise<string> {
    const deleted = await GradeCollection.deleteOne({ _id: id });

    if (deleted.ok && deleted.n) {
      return 'DELETED';
    }
    throw new ApiError(httpStatus.BAD_REQUEST, 'DELETE_CLASS_FAIL');
  }
}
