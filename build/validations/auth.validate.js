"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object().keys({
    name: joi_1.default.string().min(1).max(50).required(),
    dob: joi_1.default.string(),
    role: joi_1.default.string().valid('student', 'teacher').required(),
    email: joi_1.default.string().email().required(),
    mssv: joi_1.default.string(),
    phone: joi_1.default.string().min(10).max(12).regex(/^\d+$/),
    password: joi_1.default.string().min(6).max(30).required(),
    facebook: joi_1.default.string(),
    google: joi_1.default.string(),
});
exports.changePasswordSchema = joi_1.default.object().keys({
    oldPassword: joi_1.default.string().min(6).max(30).required(),
    newPassword: joi_1.default.string().min(6).max(30).required(),
});
