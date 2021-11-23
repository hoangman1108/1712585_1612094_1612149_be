import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import Tsoa from './app/tsoa';
import logger from './app/logger';
import database from './app/database';
import utils from './app/utils';
import events from './app/eventEmitter';
import { ConnectMailer } from './helpers/email.connect';

class Server {
  private App: express.Application;

  private tsoa: Tsoa;

  constructor() {
    this.App = express();
    // eslint-disable-next-line no-new
    new database();
    this.tsoa = new Tsoa();
    this.Middleware();
    ConnectMailer();
  }

  Middleware() {
    this.App.use(cors({
      origin: '*',
      credentials: false,
    }));
    this.App.use(cookieParser('secret'));
    this.App.use(express.json());
    this.App.use(morgan('dev'));
    this.App.use(express.urlencoded({ extended: true }));
  }

  Start() {
    this.tsoa.Init(this.App);
    events.on('CONNECT_MONGO_SUCCESS', () => {
      this.App.listen(utils.AppPort, () => {
        logger.info(`Api is now running on  ${utils.AppHost}:${utils.AppPort}/api/v1`);
        logger.info(`Docs is now running on ${utils.AppHost}:${utils.AppPort}/v1/docs`);
      });
    });
  }
}

new Server().Start();
