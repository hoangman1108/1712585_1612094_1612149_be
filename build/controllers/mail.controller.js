"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EmailController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const inversify_1 = require("inversify");
const tsoa_1 = require("tsoa");
const ioc_1 = require("../inversify/ioc");
const email_service_1 = __importDefault(require("../services/email.service"));
// import { ISendSms } from '../interfaces/sendSms.interface';
let EmailController = EmailController_1 = class EmailController extends tsoa_1.Controller {
    constructor(emailService) {
        super();
        this.emailService = emailService;
    }
    SendEmail(data) {
        const result = this.emailService.sendEmail(data.to, {
            subject: data.subject,
            title: data.title,
            body: data.body,
            type: data.type,
            info: JSON.parse(data.info)
        });
        return result;
    }
};
__decorate([
    tsoa_1.Post('/'),
    __param(0, tsoa_1.Body())
], EmailController.prototype, "SendEmail", null);
EmailController = EmailController_1 = __decorate([
    tsoa_1.Route('/email'),
    tsoa_1.Tags('Emails'),
    ioc_1.ProvideSingleton(EmailController_1),
    __param(0, inversify_1.inject(email_service_1.default))
], EmailController);
exports.EmailController = EmailController;
