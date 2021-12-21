import {
  Post, Route, Controller, Body, Tags, Request, Get,
} from 'tsoa';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import reader from 'xlsx';
import { ProvideSingleton, inject } from '../inversify/ioc';
import { UpdatePointByTeacherRequest } from '../interfaces/pointAssingment.interface';
import PointAssignmentService from '../services/pointAssignment.service';

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
  public async showFullPointInClass(
    classId: string,
  ): Promise<any> {
    const response = await this.pointService.showFullPointInClass({ classId });
    return response;
  }

  @Get('show-point-assignment/{classId}/{assignmentId}')
  public async shoưPointAssignmentInClass(
    classId: string,
    assignmentId: string,
  ): Promise<any> {
    const response = await this.pointService.showPointAssignmentInClass({ classId, assignmentId });
    return response;
  }

  // @Get('show-full-assignment-point/{classId}')
  // public async showFullAssignmentPoint(
  //   classId: string,
  // ): Promise<any> {
  //   const response = await this.pointService.showAllAssignmentPoint({ classId });
  //   return response;
  // }

  @Post('upload-file-point-by-teacher')
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
