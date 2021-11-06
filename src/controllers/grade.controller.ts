import {
  Body, Controller, Delete, Get, Post, Put, Route, Tags, Security,
} from 'tsoa';
import { IGradeCreateRequest, IGradeResponse, IGradeUpdateRequest } from '../interfaces/grade.interface';
import { ProvideSingleton, inject } from '../inversify/ioc';
import GradeService from '../services/grade.service';

@Tags('Grades')
@Route('/grades')
@ProvideSingleton(GradeController)
export class GradeController extends Controller {
  constructor(@inject(GradeService) private gradeService: GradeService) {
    super();
  }

  @Get()
  @Security('oauth2')
  public async getGrades(): Promise<IGradeResponse[]> {
    return this.gradeService.list();
  }

  @Get('/{id}')
  @Security('oauth2')
  public async getGrade(id: string): Promise<IGradeResponse> {
    return this.gradeService.detail(id);
  }

  @Post('/')
  @Security('oauth2')
  public async createGrade(@Body() data: IGradeCreateRequest): Promise<IGradeResponse> {
    return this.gradeService.create(data);
  }

  @Put('/{id}')
  @Security('oauth2')
  public async updateGrade(id: string, @Body() data: IGradeUpdateRequest): Promise<IGradeResponse> {
    return this.gradeService.update({ ...data, id });
  }

  @Delete('/{id}')
  @Security('oauth2')
  public async deleteGrade(id: string): Promise<string> {
    return this.gradeService.delete(id);
  }
}
