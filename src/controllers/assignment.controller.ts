import {
  Body, Controller, Delete, Get, Post, Put, Route, Tags, Security, Request, Query,
} from 'tsoa';
import {
  IAssignmentCreateRequest, IAssignmentResponse, IAssignmentUpdateRequest,
} from '../interfaces/assignment.interface';
import { ProvideSingleton, inject } from '../inversify/ioc';
import AssignmentService from '../services/assignment.service';

@Tags('Assignments')
@Route('/assignments')
@ProvideSingleton(AssignmentController)
export class AssignmentController extends Controller {
  constructor(@inject(AssignmentService) private assignmentService: AssignmentService) {
    super();
  }

  @Get()
  @Security('oauth2')
  public async getAssignments(
    @Query() name?: string,
      @Query() classId?: string,
  ): Promise<IAssignmentResponse[]> {
    return this.assignmentService.list({
      name, classId,
    });
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
