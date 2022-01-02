import httpStatus from 'http-status';
import {
  Body, Controller, Delete, Get, Post, Put, Route, Tags, Security, Request, Query, Path,
} from 'tsoa';
import {
  IAssignmentCreateRequest, IAssignmentResponse, IAssignmentUpdateRequest,
} from '../interfaces/assignment.interface';
import { EnumMail } from '../interfaces/sendMail.interface';
import { ProvideSingleton, inject } from '../inversify/ioc';
import { AssignmentCollection } from '../models/assignment.model';
import { ClassCollection } from '../models/class.model';
import AssignmentService from '../services/assignment.service';
import EmailService from '../services/email.service';
import { ApiError } from '../utils';

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
    const { teachers }: any = await ClassCollection.findOne({ _id: data.classId }).populate({
      path: 'teachers',
      match: {
        _id: request.user._id,
      },
    });
    if(!teachers?.length) {
      throw new ApiError(httpStatus.CONFLICT, 'YOU_NOT_A_TEACHER');
    }
    if (assignments.length > 0) {
      const assignment = await AssignmentCollection.findById(data.assignmentId);
      await assignment?.updateOne({
        mark: data.mark,
      });
      // await Promise.all(students.map((student: any) => this.emailService.sendEmail(student.email, {
      //   subject: 'Thông báo điểm',
      //   title: 'Thông báo điểm',
      //   body: 'body',
      //   type: EnumMail.NotiAllStudentAssignment,
      //   info: {
      //     name: student.name,
      //     nameAssignment: assignment?.name,
      //   } as any,
      // })));
      return 'UPDATE_MARK_SUCCESS';
    }
    return 'NOT_FOUND_ASSIGNMENT_IN_CLASS';
  }

  @Get('/{id}')
  @Security('oauth2')
  public async getAssignment(id: string): Promise<IAssignmentResponse> {
    return this.assignmentService.detail(id);
  }

  @Post('/')
  @Security('oauth2')
  public async createAssignment(@Request() request: any, @Body() data: IAssignmentCreateRequest): Promise<IAssignmentResponse> {
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
