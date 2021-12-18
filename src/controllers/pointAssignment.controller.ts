import {
  Post, Route, Controller, Body, Tags,
} from 'tsoa';
import { ProvideSingleton, inject } from '../inversify/ioc';
import { UpdatePointByTeacherRequest } from '../interfaces/pointAssingment.interface';
import PointAssignmentService from '../services/pointAssignment.service';

@Route('point-assignment')
@Tags('Point Assingments')
@ProvideSingleton(PointAssignmentController)
export class PointAssignmentController extends Controller {
  constructor(@inject(PointAssignmentService) private pointService: PointAssignmentService) {
    super();
  }

  @Post('update-by-teacher')
  public async updatePointByTeacher(
    @Body() data: UpdatePointByTeacherRequest,
  ): Promise<any> {
    const update = await this.pointService.updatePoint(data);
    return { message: update };
  }
}
