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
        throw new ApiError(httpStatus.NOT_FOUND, 'DSSV_NOT_FOUND');
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
    throw new ApiError(httpStatus.CONFLICT, 'CANNOT UPDATE POINT');
  }

  async updatePointByFileFromTeacher(data: any) {
    await Promise.all(data.list.map(async (value: any) => {
      const updated = await this.updatePoint({ ...value, classId: data.classId, assignmentId: data.assignmentId });
      return updated;
    }));
  }

  async showFullPointInClass(data: { classId: string }) {
    const { assignments }: any = await ClassCollection.findOne({ _id: data.classId }).populate('assignments').lean();
    const response = await Promise.all(assignments.map(async (assignment: any) => {
      const find = await PointAssignmentCollection.find({ assignmentId: assignment._id });
      if (find.length) {
        return {
          name: assignment.name,
          point: find.map((value) => ({
            assignmentId: value.assignmentId,
            point: value.point,
          })),
        };
      }
      return null;
    }));
    const { list: students }: any = await StudentCollection.findOne({ classId: data.classId }).lean();

    const dataResponse: any[] = students.map((val: any) => ({
      ...val, points: [],
    }));
    students.map((student: any, index: any) => response?.map((res: any) => {
      if (!res) {
        return false;
      }
      const point = res.point.find((val: any) => Number(val.MSSV) === Number(student.MSSV));
      dataResponse[index].points.push(point);

      return true;
    }));

    return dataResponse;
  }
}
