import {
  Body, Controller, Delete, Get, Post, Put, Route, Tags, Security,
} from 'tsoa';
import { IAssignmentCreateRequest, IAssignmentResponse, IAssignmentUpdateRequest } from '../interfaces/assignment.interface';
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
  public async getAssignments(): Promise<IAssignmentResponse[]> {
    return this.assignmentService.list();
  }

  @Get('/{id}')
  @Security('oauth2')
  public async getAssignment(id: string): Promise<IAssignmentResponse> {
    return this.assignmentService.detail(id);
  }

  @Post('/')
  @Security('oauth2')
  public async createAssignment(@Body() data: IAssignmentCreateRequest): Promise<IAssignmentResponse> {
    return this.assignmentService.create(data);
  }

  @Put('/{id}')
  @Security('oauth2')
  public async updateAssignment(id: string, @Body() data: IAssignmentUpdateRequest): Promise<IAssignmentResponse> {
    return this.assignmentService.update({ ...data, id });
  }

  @Delete('/{id}')
  @Security('oauth2')
  public async deleteAssignment(id: string): Promise<string> {
    return this.assignmentService.delete(id);
  }
}
