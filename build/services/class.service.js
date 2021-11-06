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
var ClassService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const ioc_1 = require("../inversify/ioc");
const class_model_1 = require("../models/class.model");
const utils_1 = require("../utils");
let ClassService = ClassService_1 = class ClassService {
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const classes = yield class_model_1.ClassCollection.find();
            return classes;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield class_model_1.ClassCollection.create(data);
            if (!created) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'CANNOT_CREATE_CLASS');
            }
            return created;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield class_model_1.ClassCollection.deleteOne({ _id: id });
            if (deleted.ok && deleted.n) {
                return 'DELETED';
            }
            throw new utils_1.ApiError(http_status_1.default.BAD_REQUEST, 'DELETE_CLASS_FAIL');
        });
    }
};
ClassService = ClassService_1 = __decorate([
    ioc_1.ProvideSingleton(ClassService_1)
], ClassService);
exports.default = ClassService;
