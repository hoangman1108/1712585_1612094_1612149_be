"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
require('dotenv').config();
const Util = {
    mongo: {
        host: process.env.MONGODB_HOST || '',
        user: process.env.MONGODB_USER || 'root',
        pass: process.env.MONGODB_PASS || 'root',
        port: process.env.MONGODB_PORT || '27017',
        db: process.env.MONGODB_DB || 'User',
    },
    email: {
        smtp: {
            pool: true,
            host: process.env.SMTP_HOST || 'smtp.googlemail.com',
            port: process.env.SMTP_PORT || '465',
            service: process.env.SMTP_SERVICE || 'Gmail',
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASS || '',
            },
        },
        from: process.env.EMAIL_FROM || '',
    },
    AppPort: process.env.PORT || 3000,
    AppHost: process.env.APP_HOST || 'http://localhost',
    env: process.env.NODE_ENV,
};
if (!Util.mongo.host) {
    logger_1.default.log('No mongo connection string. Set MONGODB_URI enviroment variable.');
    process.exit(1);
}
exports.default = Util;
