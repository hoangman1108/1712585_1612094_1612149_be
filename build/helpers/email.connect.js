"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailTemplates = exports.getTransporter = exports.ConnectMailer = void 0;
const nodemailer_1 = require("nodemailer");
const email_templates_1 = __importDefault(require("email-templates"));
const utils_1 = __importDefault(require("../app/utils"));
const logger_1 = __importDefault(require("../app/logger"));
let transporter;
let emailTemplates;
const ConnectMailer = () => {
    transporter = nodemailer_1.createTransport(utils_1.default.email.smtp);
    emailTemplates = new email_templates_1.default({
        message: {
            from: utils_1.default.email.smtp.auth.user,
        },
        send: true,
        transport: transporter,
    });
    if (utils_1.default.env !== 'test') {
        transporter
            .verify()
            .then(() => logger_1.default.info('Connected to email server'))
            .catch((error) => logger_1.default.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env', error));
    }
};
exports.ConnectMailer = ConnectMailer;
const getTransporter = () => transporter;
exports.getTransporter = getTransporter;
const getEmailTemplates = () => emailTemplates;
exports.getEmailTemplates = getEmailTemplates;
