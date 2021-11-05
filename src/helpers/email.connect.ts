import { createTransport } from 'nodemailer';
import EmailTemplates from 'email-templates';
import Mail from 'nodemailer/lib/mailer';
import utils from '../app/utils';
import logger from '../app/logger';

let transporter: Mail;
let emailTemplates: EmailTemplates;

export const ConnectMailer = () => {
  transporter = createTransport(utils.email.smtp as any);

  emailTemplates = new EmailTemplates({
    message: {
      from: utils.email.smtp.auth.user,
    },
    send: true,
    transport: transporter,
  });
  if (utils.env !== 'test') {
    transporter
      .verify()
      .then(() => logger.info('Connected to email server'))
      .catch((error) => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env', error));
  }
};

export const getTransporter = () => transporter;

export const getEmailTemplates = () => emailTemplates;
