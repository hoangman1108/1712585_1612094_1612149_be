"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ioc_1 = require("../inversify/ioc");
const token_model_1 = require("../models/token.model");
const user_model_1 = require("../models/user.model");
const utils_1 = require("../utils");
const auth_1 = __importDefault(require("../utils/auth"));
let AuthService = AuthService_1 = class AuthService {
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield user_model_1.UserCollection.findOne({
                $or: [
                    { mssv: username },
                    { email: username },
                    { phone: username },
                ],
            });
            if (!findUser) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'USER_NOT_FOUND');
            }
            const isMatch = yield findUser.comparePassword(password);
            if (!isMatch) {
                throw new utils_1.ApiError(http_status_1.default.UNAUTHORIZED, 'PASSWORD_NOT_MATCH');
            }
            const newAccessToken = yield auth_1.default.generateAccessToken({
                userId: findUser.id,
                username,
            });
            const newRefreshToken = yield auth_1.default.generateRefreshToken({
                userId: findUser.id,
                username,
            });
            const authToken = {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                userId: findUser.id,
            };
            const token = yield token_model_1.TokenCollection.create(authToken);
            return token;
        });
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserCollection.create(data);
            if (!user) {
                throw new utils_1.ApiError(http_status_1.default.INTERNAL_SERVER_ERROR, 'USER_CREATE_ERROR');
            }
            return 'CREATE_USER_SUCCESS';
        });
    }
    changePassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield user_model_1.UserCollection.findById(data.userId);
            if (!findUser) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'USER_NOT_FOUND');
            }
            const compare = yield findUser.comparePassword(data.oldPassword);
            if (!compare) {
                throw new utils_1.ApiError(http_status_1.default.BAD_REQUEST, 'PASSWORD_NOT_MATCH');
            }
            const newPassword = yield bcrypt_1.default.hash(data.newPassword, findUser.passwordSalt || '');
            const updated = yield findUser.update({
                password: newPassword,
            });
            if (updated.n && updated.ok) {
                return 'PASSWORD_CHANGED';
            }
            return 'CHANGE_PASSWORD_FAIL';
        });
    }
};
AuthService = AuthService_1 = __decorate([
    ioc_1.ProvideSingleton(AuthService_1)
], AuthService);
exports.default = AuthService;
