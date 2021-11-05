import httpStatus from 'http-status';
import Joi from 'joi';
import { ApiError } from '../utils';

export const validateMiddleware = (schema: Joi.ObjectSchema<any>, data: object) => {
  const { error } = schema.validate(data);
  if (error) {
    throw new ApiError(httpStatus.FORBIDDEN, error.message);
  }
};
