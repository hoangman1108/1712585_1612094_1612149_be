import {
  Post, Route, Request, Controller, Get, Tags,
} from 'tsoa';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import reader from 'xlsx';
import httpStatus from 'http-status';
import { ProvideSingleton, inject } from '../inversify/ioc';
import FileService from '../services/file.service';
import { StudentCollection } from '../models/student.model';
import { ApiError } from '../utils';

const { promisify } = require('util');
const cloudinary = require('cloudinary');

const unlinkAsync = promisify(fs.unlink);

cloudinary.config({
  cloud_name: 'ptudw-1712585',
  api_key: '842711986626818',
  api_secret: 'wEgGggHWY9sQOTYto-LDVZEi38g',
});

@Route('files')
@Tags('Files')
@ProvideSingleton(FilesController)
export class FilesController extends Controller {
  constructor(@inject(FileService) private fileService: FileService) {
    super();
  }

  @Post('upload-list-student')
  public async uploadFile(
    @Request() request : any,
  ): Promise<any> {
    await this.handleFile(request);
    console.log(request.file);
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
    StudentCollection.create({
      list: data,
      classId: request.body.classId,
      name: request.file.originalname,
    });
    await unlinkAsync(pathFile);

    return {
      message: 'UPLOAD_FILE_STUDENT_SUCCESS',
    };
  }

  @Get('list-student/{classId}')
  public async listStudent(classId: string): Promise<any> {
    const response = await StudentCollection.findOne({
      classId,
    });

    if (!response) {
      throw new ApiError(httpStatus.NOT_FOUND, 'NOT_FOUND');
    }
    return {
      data: response.list,
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
