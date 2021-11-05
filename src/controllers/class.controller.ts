import {
  Tags, Route, Controller, Get,
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

  @Get()
  async getClasses(): Promise<IClass[]> {
    return this.classService.list();
  }
}
