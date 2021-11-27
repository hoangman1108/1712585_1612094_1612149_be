import {
  Body, Controller, Delete, Get, Post, Put, Route, Tags, Security, Request,
} from 'tsoa';
import { IAssignmentCreateRequest, IAssignmentResponse, IAssignmentUpdateRequest, IFindAssignmentRequest } from '../interfaces/assignment.interface';
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
  public async getAssignments(data: IFindAssignmentRequest): Promise<IAssignmentResponse[]> {
    return this.assignmentService.list(data);
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

  @Put('/{id}')
  @Security('oauth2')
  public async updateAssignment(@Request() request: any, id: string, @Body() data: IAssignmentUpdateRequest): Promise<IAssignmentResponse> {
    return this.assignmentService.update({ ...data, id, teacherId: request.user.userId });
  }

  @Delete('/{id}')
  @Security('oauth2')
  public async deleteAssignment(id: string): Promise<string> {
    return this.assignmentService.delete(id);
  }
}
