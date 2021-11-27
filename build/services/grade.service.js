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
var GradeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const ioc_1 = require("../inversify/ioc");
const grade_model_1 = require("../models/grade.model");
const utils_1 = require("../utils");
let GradeService = GradeService_1 = class GradeService {
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const grades = yield grade_model_1.GradeCollection.find();
            return grades;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const grade = yield grade_model_1.GradeCollection.create(data);
            return grade;
        });
    }
    detail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const grade = yield grade_model_1.GradeCollection.findById(id);
            if (!grade) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'ASSIGNMENT_NOT_FOUND');
            }
            return grade;
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const grade = yield grade_model_1.GradeCollection.findByIdAndUpdate(data.id, data);
            if (!grade) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'ASSIGNMENT_NOT_FOUND');
            }
            return grade;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield grade_model_1.GradeCollection.deleteOne({ _id: id });
            if (deleted.ok && deleted.n) {
                return 'DELETED';
            }
            throw new utils_1.ApiError(http_status_1.default.BAD_REQUEST, 'DELETE_CLASS_FAIL');
        });
    }
};
GradeService = GradeService_1 = __decorate([
    ioc_1.ProvideSingleton(GradeService_1)
], GradeService);
exports.default = GradeService;
