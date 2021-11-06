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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const ioc_1 = require("../inversify/ioc");
const user_model_1 = require("../models/user.model");
const utils_1 = require("../utils");
let UserService = UserService_1 = class UserService {
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_model_1.UserCollection.find();
            return users;
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserCollection.findById(id);
            if (!user) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'USER_NOT_FOUND');
            }
            return user;
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserCollection.findByIdAndUpdate(data.id, data);
            if (!user) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'USER_NOT_FOUND');
            }
            return user;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserCollection.findByIdAndDelete(id);
            if (!user) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'USER_NOT_FOUND');
            }
            return user;
        });
    }
};
UserService = UserService_1 = __decorate([
    ioc_1.ProvideSingleton(UserService_1)
], UserService);
exports.default = UserService;
