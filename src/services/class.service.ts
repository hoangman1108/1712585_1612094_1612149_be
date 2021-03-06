import httpStatus from 'http-status';
import { IAssignmentResponse } from '../interfaces/assignment.interface';
import { IClass, IClassAddUser } from '../interfaces/class.interface';
import { ProvideSingleton } from '../inversify/ioc';
import { ClassCollection } from '../models/class.model';
import { UserCollection } from '../models/user.model';
import { ApiError } from '../utils';

@ProvideSingleton(ClassService)
export default class ClassService {
  async list(): Promise<IClass[]> {
    const classes: IClass[] = await ClassCollection.find();
    return classes;
  }

  async create(data: IClass): Promise<IClass> {
    const existsClass = await ClassCollection.findOne({
      name: data.name,
    });
    if (existsClass) {
      throw new ApiError(httpStatus.CONFLICT, 'NAME_CLASS_EXISTS');
    }
    const created = await ClassCollection.create(data);
    if (!created) {
      throw new ApiError(httpStatus.NOT_FOUND, 'CANNOT_CREATE_CLASS');
    }
    return created;
  }

  async addStudent(data: IClassAddUser): Promise<IClass> {
    const findClass = await ClassCollection.findOne({ _id: data.classId });
    if (!findClass) {
      throw new ApiError(httpStatus.NOT_FOUND, 'STUDENT_NOT_FOUND');
    }
    const { students }: any = await ClassCollection.findOne({ _id: data.classId })
      .populate({
        path: 'students',
        match: {
          _id: data.userId,
        },
      });
    if (students.length > 0) {
      throw new ApiError(httpStatus.CONFLICT, 'USER_IS_EXISTS_IN_CLASS');
    }

    const findStudent = await UserCollection.findById(data.userId).lean();
    if (!findStudent) {
      throw new ApiError(httpStatus.NOT_FOUND, 'STUDENT_NOT_FOUND');
    }

    findClass.students?.push(data.userId);
    findClass.save();
    return findClass.toObject();
  }

  async addTeacher(data: IClassAddUser): Promise<IClass> {
    const findClass = await ClassCollection.findOne({ _id: data.classId });
    if (!findClass) {
      throw new ApiError(httpStatus.NOT_FOUND, 'TEACHER_NOT_FOUND');
    }
    const { teachers }: any = await ClassCollection.findOne({ _id: data.classId })
      .populate({
        path: 'teachers',
        match: {
          _id: data.userId,
        },
      });
    if (teachers.length > 0) {
      throw new ApiError(httpStatus.CONFLICT, 'USER_IS_EXISTS_IN_CLASS');
    }

    const findStudent = await UserCollection.findById(data.userId).lean();
    if (!findStudent) {
      throw new ApiError(httpStatus.NOT_FOUND, 'STUDENT_NOT_FOUND');
    }

    findClass.teachers?.push(data.userId);
    findClass.save();
    return findClass.toObject();
  }

  async checkUserInClass(classId: string, userId: string): Promise<boolean> {
    const { teachers }: any = await ClassCollection.findOne({ _id: classId })
      .populate({
        path: 'teachers',
        match: {
          _id: userId,
        },
      });

    const { students }: any = await ClassCollection.findOne({ _id: classId })
      .populate({
        path: 'students',
        match: {
          _id: userId,
        },
      });

    return teachers.length > 0 || students.length > 0;
  }

  async delete(id: string): Promise<string> {
    const deleted = await ClassCollection.deleteOne({ _id: id });
    if (deleted.ok && deleted.n) {
      return 'DELETED';
    }

    throw new ApiError(httpStatus.BAD_REQUEST, 'DELETE_CLASS_FAIL');
  }

  async detailFullFill(id: string): Promise<IClass> {
    const data = await ClassCollection.findById(id).populate('students').populate('teachers').populate('assignments');
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'CLASS_ID_NOT_FOUND');
    }
    return data;
  }

  async getInfoAssignment(id: string): Promise<IAssignmentResponse> {
    const { assignments }: any = await ClassCollection.findById(id).populate('assignments');
    return assignments;
  }

  async updateAssignments(id: string, data: { assignments: string[] }): Promise<IClass> {
    const updated = await ClassCollection.findByIdAndUpdate(id, { assignments: data.assignments }, { new: true });
    if (!updated) {
      throw new ApiError(httpStatus.NOT_FOUND, 'CLASS_NOT_FOUND');
    }
    return updated;
  }

  async joinClass(data: IClassAddUser): Promise<IClass> {
    const findStudent = await UserCollection.findById(data.userId).lean();
    if (!findStudent) {
      throw new ApiError(httpStatus.NOT_FOUND, 'STUDENT_NOT_FOUND');
    }

    if (findStudent.role === 'teacher') {
      return this.addTeacher(data);
    }
    return this.addStudent(data);
  }
}
