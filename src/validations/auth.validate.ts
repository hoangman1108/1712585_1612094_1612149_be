import Joi from 'joi';

export const registerSchema = Joi.object().keys({
  name: Joi.string().min(1).max(50).required(),
  dob: Joi.string().required(),
  role: Joi.string().valid('student', 'teacher').required(),
  email: Joi.string().email().required(),
  mssv: Joi.string().required(),
  phone: Joi.string().min(10).max(12).regex(/^\d+$/),
  password: Joi.string().min(6).max(30).required(),
  facebook: Joi.string(),
  google: Joi.string(),
});

export const changePasswordSchema = Joi.object().keys({
  oldPassword: Joi.string().min(6).max(30).required(),
  newPassword: Joi.string().min(6).max(30).required(),
});
