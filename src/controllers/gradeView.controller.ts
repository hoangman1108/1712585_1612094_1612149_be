import {
  Tags, Route, Controller, Post, Body, Get, Security, Request,
} from 'tsoa';
import {
  IComment, IGradeViewRequest, IGradeViewResponse, IUpdateMarkRequest,
} from '../interfaces/gradeView.interface';
import { EnumMail } from '../interfaces/sendMail.interface';
import { ProvideSingleton, inject } from '../inversify/ioc';
import { GradeViewCollection } from '../models/gradeView.model';
import PointAssignmentCollection from '../models/pointAssignment.model';
import { UserCollection } from '../models/user.model';
import EmailService from '../services/email.service';

@Route('/grade-view')
@Tags('Grade Views')
@Security('oauth2')
@ProvideSingleton(GradeViewController)
export class GradeViewController extends Controller {
  constructor(@inject(EmailService) private emailService: EmailService) {
    super();
  }

  @Post('/')
  @Security('oauth2')
  async createGradeView(@Body() data: IGradeViewRequest): Promise<IGradeViewResponse | any> {
    const checkPoint = await PointAssignmentCollection.findOne({ assignmentId: data.composition, MSSV: data.Mssv, point: { $exists: true } });

    if (!checkPoint) {
      return {
        message: 'NOT_FOUND_POINT_ASSIGNMENT_FOR_MSSV_OR_MSSV_NOT_MATCH',
      };
    }
    const find = await GradeViewCollection.findOne({
      Mssv: data.Mssv,
      classId: data.classId,
      studentId: data.studentId,
      composition: data.composition,
    });
    if (find) {
      return { message: 'GRADE_VIEW_EXISTS' };
    }

    const create: IGradeViewResponse = await GradeViewCollection.create(data);
    return create;
  }

  @Post('/comment/{gradeViewId}')
  @Security('oauth2')
  async commentGradeView(@Body() data: IComment, gradeViewId: string): Promise<IGradeViewResponse | any> {
    const find = await GradeViewCollection.findById(gradeViewId);
    if (!find) {
      return { message: 'GRADE_VIEW_NOT_EXISTS' };
    }
    find.comments?.push(data);
    await find.save();
    return { message: 'GRADE_UPDATE_SUCCESS' };
  }

  @Get('/{classId}/class')
  @Security('oauth2')
  async listGradeView(classId: string): Promise<IGradeViewResponse[]> {
    const data: IGradeViewResponse[] = await GradeViewCollection.find({
      classId,
    }).populate('composition', 'name');
    return data;
  }

  @Post('/update-mark')
  @Security('oauth2')
  async updateMarkGradeView(@Body() data: IUpdateMarkRequest): Promise<{ message: string }> {
    const find = await GradeViewCollection.findById(data.gradeViewId);
    if (!find) {
      return { message: 'GRADE_VIEW_NOT_EXISTS' };
    }
    find.mark = data.mark;
    const point = await PointAssignmentCollection.findOne({
      MSSV: find.Mssv,
      assignmentId: find.composition,
    });
    if (!point) {
      return { message: 'POINT_ASSIGNMENT_NOT_EXISTS' };
    }
    point.point = find.expect;
    await point.save();
    await find.save();
    const student = await UserCollection.findById(find.studentId);
    if (student) {
      await this.emailService.sendEmail(student.email, {
        subject: 'Đã cập nhật điểm',
        title: 'Đã cập nhật điểm',
        body: 'body',
        type: EnumMail.NotiAllStudentAssignment,
        info: {
          url: 'http://localhost/confirm-account',
          name: student.name,
        } as any,
      });
    }
    return {
      message: 'UPDATE_MARK_SUCCESS',
    };
  }
}
