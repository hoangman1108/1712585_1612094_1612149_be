"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMiddleware = void 0;
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../utils");
const validateMiddleware = (schema, data) => {
    const { error } = schema.validate(data);
    if (error) {
        throw new utils_1.ApiError(http_status_1.default.FORBIDDEN, error.message);
    }
};
exports.validateMiddleware = validateMiddleware;
