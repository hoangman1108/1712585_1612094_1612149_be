import {
  Post, Route, Controller, Body, Tags, Request, Get, Security,
} from 'tsoa';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import reader from 'xlsx';
import { ProvideSingleton, inject } from '../inversify/ioc';
import { UpdatePointByTeacherRequest } from '../interfaces/pointAssingment.interface';
import PointAssignmentService from '../services/pointAssignment.service';
import PointAssignmentCollection from '../models/pointAssignment.model';
import { UserCollection } from '../models/user.model';
import { AssignmentCollection } from '../models/assignment.model';

const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

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

  @Get('show-full-point/{classId}')
  @Security('oauth2')
  public async showFullPointInClass(
    classId: string,
  ): Promise<any> {
    const response = await this.pointService.showFullPointInClass({ classId });
    return response;
  }

  @Get('show-point-student/{assignmentId}')
  @Security('oauth2')
  public async showPointAssignmentForStudent(
    @Request() request: any, assignmentId: string,
  ): Promise<any> {
    const student = await UserCollection.findById(request.user.userId);
    if (!student?.mssv) {
      return {
        message: 'STUDENT_NOT_MAPPING_MSSV',
      };
    }
    const checkAssignment = await AssignmentCollection.findById(assignmentId);
    if (!checkAssignment) {
      return {
        message: 'ASSIGNMENT_NOT_FOUND',
      };
    }

    if (!checkAssignment?.mark) {
      return { message: 'NO_SCORE_FOR_THIS_ASSIGNMENT' };
    }
    const result = await PointAssignmentCollection.findOne({
      assignmentId,
      MSSV: student.mssv,
    });
    if (!result) {
      return {
        message: 'NOT_FOUND_POINT_ASSIGNMENT',
      };
    }
    return result;
  }

  @Get('show-point-student-in-profile')
  @Security('oauth2')
  public async showPointStudentInProfile(
    @Request() request: any,
  ): Promise<any> {
    const student = await UserCollection.findById(request.user.userId);
    if (!student?.mssv) {
      return {
        message: 'STUDENT_NOT_MAPPING_MSSV',
      };
    }
    const result = await PointAssignmentCollection.find({
      MSSV: student.mssv,
    }).populate('classId', 'name').populate('assignmentId', 'name');
    if (!result) {
      return {
        message: 'NOT_FOUND_POINT_ASSIGNMENT',
      };
    }
    return result;
  }

  @Get('show-point-assignment/{classId}/{assignmentId}')
  @Security('oauth2')
  public async showPointAssignmentInClass(
    classId: string,
    assignmentId: string,
  ): Promise<any> {
    const response = await this.pointService.showPointAssignmentInClass({ classId, assignmentId });
    return response;
  }

  @Post('upload-file-point-by-teacher')
  @Security('oauth2')
  public async uploadPointByTeacher(
    @Request() request: any,
  ): Promise<any> {
    await this.handleFile(request);
    const pathFile = request.file.destination + request.file.originalname;
    fs.renameSync(request.file.path, pathFile);
    const file = reader.readFile(`uploads/${request.file.originalname}`);

    const sheets = file.SheetNames;

    const data = sheets.map((_, i) => {
      const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]],
      );
      return temp;
    });

    await this.pointService.updatePointByFileFromTeacher({
      list: data[0],
      assignmentId: request.body.assignmentId,
      classId: request.body.classId,
    });
    await unlinkAsync(pathFile);

    return {
      message: 'UPLOAD_FILE_STUDENT_SUCCESS',
    };
  }

  private handleFile(request: express.Request): Promise<any> {
    const multerSingle: any = multer({ dest: 'uploads/' }).single('file');
    return new Promise((resolve: any, reject) => {
      multerSingle(request, undefined, async (error: any) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }
}
