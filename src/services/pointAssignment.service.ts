import httpStatus from 'http-status';
import { UpdatePointByTeacherRequest } from '../interfaces/pointAssingment.interface';
import { ProvideSingleton } from '../inversify/ioc';
import { ClassCollection } from '../models/class.model';
import PointAssignmentCollection from '../models/pointAssignment.model';
import { StudentCollection } from '../models/student.model';
import { ApiError } from '../utils';

@ProvideSingleton(PointAssignmentService)
export default class PointAssignmentService {
  async updatePoint(data: UpdatePointByTeacherRequest) {
    const find = await PointAssignmentCollection.findOne({ classId: data.classId, assignmentId: data.assignmentId, MSSV: data.MSSV }).lean();
    if (!find) {
      const dssv = await StudentCollection.findOne({ classId: data.classId });
      if (!dssv) {
        throw new ApiError(httpStatus.NOT_FOUND, 'FILE_COLLECTION_NOT_FOUND');
      }
      await Promise.all(dssv.list.map(async (value) => {
        await PointAssignmentCollection.create({
          ...value, classId: data.classId, assignmentId: data.assignmentId,
        });
      }));
    }
    const update = await PointAssignmentCollection.findOneAndUpdate(
      {
        classId: data.classId,
        assignmentId: data.assignmentId,
        MSSV: data.MSSV,
      }, { point: data.point }, { new: true },
    );
    if (update) {
      return 'UPDATED';
    }
    throw new ApiError(httpStatus.CONFLICT, 'CANNOT UPDATE POiNT');
  }

  async updatePointByFileFromTeacher(data: any) {
    await Promise.all(data.list.map(async (value: any) => {
      const updated = await this.updatePoint({ ...value, classId: data.classId, assignmentId: data.assignmentId });
      return updated;
    }));
  }

  async showFullPointInClass(data: { classId: string }) {
    const { assignments }: any = await ClassCollection.findOne({ _id: data.classId }).populate('assignments').lean();
    assignments.map(async (assignment: any) => {
      const find = await PointAssignmentCollection.find({ assignmentId: assignment._id });
      console.log('find: ', find);
      return find;
    });
    return assignments;
  }
}
