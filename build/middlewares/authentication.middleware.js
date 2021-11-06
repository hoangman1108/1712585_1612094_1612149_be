"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = void 0;
const http_status_1 = __importDefault(require("http-status"));
const token_model_1 = require("../models/token.model");
const utils_1 = require("../utils");
const auth_1 = __importDefault(require("../utils/auth"));
function expressAuthentication(request, securityName, scopes) {
    return __awaiter(this, void 0, void 0, function* () {
        if (securityName === 'oauth2') {
            const token = request.body.token || request.query.token || request.headers.authorization;
            return auth_1.default.verifyJWT(token).then((result) => __awaiter(this, void 0, void 0, function* () {
                const itoken = yield token_model_1.TokenCollection.findOne({ userId: result.userId });
                if (!itoken) {
                    throw new utils_1.ApiError(http_status_1.default.FORBIDDEN, 'ACCOUNT_ACCESS_DENIED');
                }
                return result;
            }));
        }
    });
}
exports.expressAuthentication = expressAuthentication;
