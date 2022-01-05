import {
  Tags, Route, Controller, Post, Body, Get,
} from 'tsoa';
import {
  IComment, IGradeViewRequest, IGradeViewResponse, IUpdateMarkRequest,
} from '../interfaces/gradeView.interface';
import { ProvideSingleton } from '../inversify/ioc';
import { GradeViewCollection } from '../models/gradeView.model';

@Route('/grade-view')
@Tags('Grade Views')
@ProvideSingleton(GradeViewController)
export class GradeViewController extends Controller {
  @Post('/')
  async createGradeView(@Body() data: IGradeViewRequest): Promise<IGradeViewResponse | any> {
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
  async listGradeView(classId: string): Promise<IGradeViewResponse[]> {
    const data: IGradeViewResponse[] = await GradeViewCollection.find({
      classId,
    });
    return data;
  }

  @Post('/update-mark')
  async updateMarkGradeView(@Body()data: IUpdateMarkRequest): Promise<{ message: string }> {
    const find = await GradeViewCollection.findById(data.gradeViewId);
    if (!find) {
      return { message: 'GRADE_VIEW_NOT_EXISTS' };
    }
    find.mark = data.mark;
    await find.save();
    return {
      message: 'UPDATE_MARK_SUCCESS',
    };
  }
}
