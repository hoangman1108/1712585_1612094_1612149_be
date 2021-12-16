import {
  Post, Route, Request, Controller,
} from 'tsoa';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { ProvideSingleton, inject } from '../inversify/ioc';
import FileService from '../services/file.service';

const { promisify } = require('util');
const cloudinary = require('cloudinary');

const unlinkAsync = promisify(fs.unlink);

cloudinary.config({
  cloud_name: 'ptudw-1712585',
  api_key: '842711986626818',
  api_secret: 'wEgGggHWY9sQOTYto-LDVZEi38g',
});

@Route('files')
@ProvideSingleton(FilesController)
export class FilesController extends Controller {
  constructor(@inject(FileService) private fileService: FileService) {
    super();
  }

  @Post('uploadFile')
  public async uploadFile(
    @Request() request : any,
  ): Promise<any> {
    await this.handleFile(request);
    const pathFile = request.file.destination + request.file.originalname;
    fs.renameSync(request.file.path, pathFile);
    return cloudinary.v2.uploader.upload(
      pathFile,
      { resource_type: 'raw' },
      async (err: any, result: any) => {
        await unlinkAsync(pathFile);
        if (err) {
          throw err;
        } else {
          const input: any = {
            size: result.bytes,
            path: result.url,
            type: result.format,
            name: request.file.originalname,
            base: request.body.base64Url,
          };
          return this.fileService.create(input).then((value) => value);
        }
      },
    );
  }

  private handleFile(request: express.Request): Promise<any> {
    const multerSingle: any = multer({ dest: 'uploads/' }).single('file');
    // const upload = multer({ dest: 'uploads/' });
    // upload.single('file'),
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
