import {
  Body, Controller, Delete, Get, Post, Put, Route, Tags, Security, Request, Query,
} from 'tsoa';
import {
  IAssignmentCreateRequest, IAssignmentResponse, IAssignmentUpdateRequest,
} from '../interfaces/assignment.interface';
import { EnumMail } from '../interfaces/sendMail.interface';
import { ProvideSingleton, inject } from '../inversify/ioc';
import { AssignmentCollection } from '../models/assignment.model';
import { ClassCollection } from '../models/class.model';
import PointAssignmentCollection from '../models/pointAssignment.model';
import { StudentCollection } from '../models/student.model';
import AssignmentService from '../services/assignment.service';
import EmailService from '../services/email.service';

@Tags('Assignments')
@Route('/assignments')
@ProvideSingleton(AssignmentController)
export class AssignmentController extends Controller {
  constructor(@inject(AssignmentService) private assignmentService: AssignmentService, @inject(EmailService) private emailService: EmailService) {
    super();
  }

  @Get()
  @Security('oauth2')
  public async getAssignments(
    @Query() name?: string,
  ): Promise<IAssignmentResponse[]> {
    return this.assignmentService.list({
      name,
    });
  }

  @Post('/mark')
  @Security('oauth2')
  public async changeMarkAssignment(@Request() request: any, @Body() data: {
    classId: string;
    assignmentId: string;
    mark: boolean;
  }): Promise<any> {
    const { assignments }: any = await ClassCollection.findOne({ _id: data.classId }).populate({
      path: 'assignments',
      match: {
        _id: data.assignmentId,
      },
    });
    if (assignments.length > 0) {
      const assignment = await AssignmentCollection.findById(data.assignmentId);
      const findPointAssignment = await PointAssignmentCollection.find({
        assignmentId: assignment?._id,
        point: { $exists: true },
      }).lean();
      const { list }: any = await StudentCollection.findOne({ classId: data.classId });
      if (findPointAssignment.length !== list?.length) {
        return 'NEED_FILL_SCORE_FOR_ALL_STUDENT_BEFORE_MARK_DONE';
      }
      await assignment?.updateOne({
        mark: data.mark,
      });
      if (data.mark) {
        const { students }: any = await ClassCollection.findOne({ _id: data.classId }).populate('students');
        await Promise.all(students?.map((student: any) => this.emailService.sendEmail(student.email, {
          subject: 'Th??ng b??o ??i???m',
          title: 'Th??ng b??o ??i???m',
          body: 'body',
          type: EnumMail.NotiAllStudentAssignment,
          info: {
            name: student.name,
            nameAssignment: assignment?.name,
          } as any,
        })));
      }
      return 'UPDATE_MARK_SUCCESS';
    }
    return 'NOT_FOUND_ASSIGNMENT_IN_CLASS';
  }

  @Get('/{id}')
  @Security('oauth2')
  public async getAssignment(id: string): Promise<IAssignmentResponse> {
    return this.assignmentService.detail(id);
  }

  @Get('/mark-done/{classId}')
  // @Security('oauth2')
  public async getAssignmentMarkDone(classId: string): Promise<IAssignmentResponse[]> {
    const data: any = await ClassCollection.findOne({ _id: classId }).populate('assignments');
    const response = data?.assignments?.filter((assignment: any) => assignment.mark === true) || [];
    return response;
  }

  @Post('/')
  @Security('oauth2')
  public async createAssignment(@Request() request: any, @Body() data: IAssignmentCreateRequest): Promise<IAssignmentResponse> {
    const { students }: any = await ClassCollection.findOne({ _id: data.classId }).populate('students');
    await Promise.all(students?.map((student: any) => this.emailService.sendEmail(student.email, {
      subject: 'New Assignment',
      title: 'New Assignment',
      body: 'body',
      type: EnumMail.NewAssignment,
      info: {
        name: student.name,
        nameAssignment: data.name,
      } as any,
    })));
    return this.assignmentService.create({
      ...data,
      teacherId: request.user.userId,
    });
  }

  @Put('/{assignmentId}')
  @Security('oauth2')
  public async updateAssignment(@Request() request: any, assignmentId: string, @Body() data: IAssignmentUpdateRequest): Promise<IAssignmentResponse> {
    return this.assignmentService.update({ ...data, id: assignmentId, teacherId: request.user.userId });
  }

  @Delete('/{assignmentId}')
  @Security('oauth2')
  public async deleteAssignment(assignmentId: string): Promise<string> {
    return this.assignmentService.delete(assignmentId);
  }
}
