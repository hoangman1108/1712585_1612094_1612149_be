import { inject } from 'inversify';
import {
  Body, Controller, Post, Route, Tags,
} from 'tsoa';
import { IMail, ISendMail } from '../interfaces/sendMail.interface';
import { ProvideSingleton } from '../inversify/ioc';
import EmailService from '../services/email.service';
// import { ISendSms } from '../interfaces/sendSms.interface';
@Route('/email')
@Tags('Emails')
@ProvideSingleton(EmailController)
export class EmailController extends Controller {
  constructor(@inject(EmailService) private emailService: EmailService) {
    super();
  }

  @Post('/')
  SendEmail(@Body() data: IMail): Promise<ISendMail> {
    const result = this.emailService.sendEmail(data.to, {
      subject: data.subject,
      title: data.title,
      body: data.body,
      type: data.type,
      info: JSON.parse(data.info)
    });
    return result;
  }
}
