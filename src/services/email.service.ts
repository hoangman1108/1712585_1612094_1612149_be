import EmailTemplates from 'email-templates';
import path from 'path';
import httpStatus from 'http-status';
import { ProvideSingleton } from '../inversify/ioc';
import { getEmailTemplates } from '../helpers/email.connect';
import logger from '../app/logger';
import { ISendMail } from '../interfaces/sendMail.interface';
import ApiError from '../utils/apiError';

@ProvideSingleton(EmailService)
export default class EmailService {
  private emailTemplates: EmailTemplates;

  constructor() {
    this.emailTemplates = getEmailTemplates();
  }

  async customSendMail(to: string, data: ISendMail) {
    const dataSend: any = { ...data };
    delete dataSend.type;
    try {
      await this.emailTemplates.send({
        template: path.join(__dirname, '../', 'templates', `/${data.type}`),
        message: {
          to,
        },
        locals: {
          data,
        },
      });
      logger.info('Send email success');
    } catch (error: any) {
      logger.error(error);
    }
  }

  async sendEmail(to: string, data: ISendMail) {
    try {
      await this.customSendMail(to, data);
      return {
        ...data,
        to,
      };
    } catch {
      throw new ApiError(httpStatus.BAD_REQUEST, 'send email failed');
    }
  }
}
