import {
  Tags, Route, Controller, Get, Post, Delete, Body, Security, Request,
} from 'tsoa';
import { IClass } from '../interfaces/class.interface';
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

  @Post('/')
  @Security('oauth2')
  async createClass(@Request() request: any, @Body() data: IClass): Promise<IClass> {
    return {} as any;
    return this.classService.create(data);
  }

  @Delete('/{classId}')
  @Security('oauth2')
  async deleteClass(classId: string): Promise<string> {
    return this.classService.delete(classId);
  }
}
