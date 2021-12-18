import httpStatus from 'http-status';
import { UpdatePointByTeacherRequest } from '../interfaces/pointAssingment.interface';
import { ProvideSingleton } from '../inversify/ioc';
import PointAssignmentCollection from '../models/pointAssignment.model';
import { StudentCollection } from '../models/student.model';
import { ApiError } from '../utils';

@ProvideSingleton(PointAssignmentService)
export default class PointAssignmentService {
  async updatePoint(data: UpdatePointByTeacherRequest) {
    const find = await PointAssignmentCollection.findOne({ classId: data.classId, assignmentId: data.assignmentId, mssv: data.mssv }).lean();
    if (!find) {
      const dssv = await StudentCollection.findOne({ classId: data.classId });
      if (!dssv) {
        throw new ApiError(httpStatus.NOT_FOUND, 'FILE_COLLECTION_NOT_FOUND');
      }
      await Promise.all(dssv.list.map(async (value) => {
        await PointAssignmentCollection.create({
          ...value, classId: data.classId, assignmentId: data.assignmentId, mssv: data.mssv,
        });
      }));
    }
    const update = await PointAssignmentCollection.findOneAndUpdate(
      {
        classId: data.classId,
        assignmentId: data.assignmentId,
        mssv: data.mssv,
      }, { point: data.point }, { new: true },
    );
    if (update) {
      return 'UPDATED';
    }
    throw new ApiError(httpStatus.CONFLICT, 'CANNOT UPDATE POiNT');
  }
}
