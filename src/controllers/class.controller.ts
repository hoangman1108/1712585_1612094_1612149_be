import {
  Tags, Route, Controller, Get, Post, Delete, Body, Security, Request, Patch,
} from 'tsoa';
import { IAssignmentResponse } from '../interfaces/assignment.interface';
import { IClass, IClassAddUser } from '../interfaces/class.interface';
import { ProvideSingleton, inject } from '../inversify/ioc';
import ClassService from '../services/class.service';

@Route('/classes')
@Tags('Classes')
@ProvideSingleton(ClassController)
export class ClassController extends Controller {
  constructor(@inject(ClassService) private classService: ClassService) {
    super();
  }

  @Get('/')
  @Security('oauth2')
  async getClasses(): Promise<IClass[]> {
    return this.classService.list();
  }

  @Get('/admin-get-classes')
  @Security('admin')
  async getClassesFromAdmin(): Promise<IClass[]> {
    return this.classService.list();
  }

  @Get('/{classId}')
  @Security('oauth2')
  async getDetailClass(classId: string): Promise<IClass> {
    return this.classService.detailFullFill(classId);
  }

  @Get('/{classId}/assignments')
  @Security('oauth2')
  public async getAssignmentInClass(classId: string): Promise<IAssignmentResponse> {
    return this.classService.getInfoAssignment(classId);
  }

  @Patch('/{classId}/assignments')
  @Security('oauth2')
  public async updateAssignmentInClass(classId: string, @Body() data: { assignments: string[] }): Promise<IClass> {
    return this.classService.updateAssignments(classId, data);
  }

  @Get('/{classId}/checkUser')
  @Security('oauth2')
  async checkUserInClass(@Request() request: any, classId: string): Promise<boolean> {
    return this.classService.checkUserInClass(classId, request.user.userId);
  }

  @Post('/')
  @Security('oauth2')
  async createClass(@Request() request: any, @Body() data: IClass): Promise<IClass> {
    return this.classService.create(data);
  }

  @Post('/addStudent')
  @Security('oauth2')
  async addStudent(@Request() request: any, @Body() data: IClassAddUser): Promise<IClass> {
    return this.classService.addStudent(data);
  }

  @Post('/addTeacher')
  @Security('oauth2')
  async addTeacher(@Request() request: any, @Body() data: IClassAddUser): Promise<IClass> {
    return this.classService.addTeacher(data);
  }

  @Delete('/{classId}')
  @Security('oauth2')
  async deleteClass(classId: string): Promise<string> {
    return this.classService.delete(classId);
  }

  @Post('/joinClass')
  @Security('oauth2')
  async joinClass(@Request() request: any, @Body() data: IClassAddUser): Promise<IClass> {
    return this.classService.joinClass(data);
  }
}
