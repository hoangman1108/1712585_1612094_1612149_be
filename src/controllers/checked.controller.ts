import {
  Body, Controller, Get, Post, Route, Tags, Security, Request, Query,
} from 'tsoa';
import { ProvideSingleton } from '../inversify/ioc';
import { AssignmentCheckedCollection } from '../models/checked.model';
import { UserCollection } from '../models/user.model';

@Tags('Assignments Checked')
@Route('/assignments-checked')
@ProvideSingleton(AssignmentCheckedController)
export class AssignmentCheckedController extends Controller {
  @Get('/{assignmentId}')
  @Security('oauth2')
  public async checkAssignmentChecked(
    @Request() request: any,
      assignmentId: string,
  ): Promise<any> {
    const user = await UserCollection.findById(request.user.userId);
    if (user?.role !== 'student') {
      return {
        message: 'ONLY_STUDENT_CAN_CHECK_ASSIGNMENT',
      };
    }
    const check = await AssignmentCheckedCollection.findOne({
      assignmentId,
      studentId: request.user.userId,
    }).lean();
    return check ? { checked: check.checked } : { checked: false };
  }

  @Post('/{assignmentId}')
  @Security('oauth2')
  public async updateChecked(
    @Request() request: any,
      @Body() data: {
        checked: boolean;
      },
      assignmentId: string,
  ): Promise<any> {
    const user = await UserCollection.findById(request.user.userId);
    if (user?.role !== 'student') {
      return {
        message: 'ONLY_STUDENT_CAN_CHECK_ASSIGNMENT',
      };
    }
    const find = await AssignmentCheckedCollection.findOne({
      assignmentId,
      studentId: request.user.userId,
    });
    if (!find) {
      const create = await AssignmentCheckedCollection.create({
        assignmentId,
        studentId: request.user.userId,
        checked: data.checked,
      });
      return create;
    }
    const update = await AssignmentCheckedCollection.findOneAndUpdate({
      assignmentId,
      studentId: request.user.userId,
    }, { checked: data.checked }, { new: true });
    return update;
  }
}
