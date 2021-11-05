import {
  Application,
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { ValidateError } from 'tsoa';
import logger from './logger';
import { RegisterRoutes } from '../routes/routes';
import utils from './utils';
import ApiError from '../utils/apiError';

export default class Tsoa {
  async Init(App: Application) {
    RegisterRoutes(App);

    const options = {
      explorer: true,
      customSiteTitle: 'Gateway API',
    };

    try {
      const swaggerDocument = require('../routes/swagger.json');
      if (utils.env === 'development') {
        App.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
      } else {
        App.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
      }

      App.use((
        err: any,
        req: ExRequest,
        res: ExResponse,
        next: NextFunction,
      ): ExResponse | void => {
        if (err instanceof ValidateError) {
          logger.warn(`Caught Validation Error for ${req.path}:`, err.fields);
          return res.status(422).json({
            message: 'Validation Failed',
            details: err?.fields,
          });
        }
        if (err instanceof ApiError) {
          const { statusCode, message } = err;
          return res.status(statusCode).send({ message });
        }
        if (err instanceof Error) {
          return res.status(500).send({
            message: err.message,
          });
        }
        next();
      });
    } catch (error) {
      logger.error('Unable to load swagger.json', error);
    }
  }
}
