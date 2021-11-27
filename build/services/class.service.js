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
const user_model_1 = require("../models/user.model");
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
            const existsClass = yield class_model_1.ClassCollection.findOne({
                name: data.name,
            });
            if (existsClass) {
                throw new utils_1.ApiError(http_status_1.default.CONFLICT, 'NAME_CLASS_EXISTS');
            }
            const created = yield class_model_1.ClassCollection.create(data);
            if (!created) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'CANNOT_CREATE_CLASS');
            }
            return created;
        });
    }
    addStudent(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const findClass = yield class_model_1.ClassCollection.findOne({ _id: data.classId });
            if (!findClass) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'STUDENT_NOT_FOUND');
            }
            const { students } = yield class_model_1.ClassCollection.findOne({ _id: data.classId })
                .populate({
                path: 'students',
                match: {
                    _id: data.userId,
                },
            });
            if (students.length > 0) {
                throw new utils_1.ApiError(http_status_1.default.CONFLICT, 'USER_IS_EXISTS_IN_CLASS');
            }
            const findStudent = yield user_model_1.UserCollection.findById(data.userId).lean();
            if (!findStudent) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'STUDENT_NOT_FOUND');
            }
            (_a = findClass.students) === null || _a === void 0 ? void 0 : _a.push(data.userId);
            findClass.save();
            return findClass.toObject();
        });
    }
    addTeacher(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const findClass = yield class_model_1.ClassCollection.findOne({ _id: data.classId });
            if (!findClass) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'TEACHER_NOT_FOUND');
            }
            const { teachers } = yield class_model_1.ClassCollection.findOne({ _id: data.classId })
                .populate({
                path: 'teachers',
                match: {
                    _id: data.userId,
                },
            });
            if (teachers.length > 0) {
                throw new utils_1.ApiError(http_status_1.default.CONFLICT, 'USER_IS_EXISTS_IN_CLASS');
            }
            const findStudent = yield user_model_1.UserCollection.findById(data.userId).lean();
            if (!findStudent) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'STUDENT_NOT_FOUND');
            }
            (_a = findClass.teachers) === null || _a === void 0 ? void 0 : _a.push(data.userId);
            findClass.save();
            return findClass.toObject();
        });
    }
    checkUserInClass(classId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { teachers } = yield class_model_1.ClassCollection.findOne({ _id: classId })
                .populate({
                path: 'teachers',
                match: {
                    _id: userId,
                },
            });
            const { students } = yield class_model_1.ClassCollection.findOne({ _id: classId })
                .populate({
                path: 'students',
                match: {
                    _id: userId,
                },
            });
            return teachers.length > 0 || students.length > 0;
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
    detailFullFill(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield class_model_1.ClassCollection.findById(id).populate('students').populate('teachers');
            if (!data) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'CLASS_ID_NOT_FOUND');
            }
            return data;
        });
    }
    joinClass(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const findStudent = yield user_model_1.UserCollection.findById(data.userId).lean();
            if (!findStudent) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'STUDENT_NOT_FOUND');
            }
            if (findStudent.role === 'teacher') {
                return this.addTeacher(data);
            }
            return this.addStudent(data);
        });
    }
};
ClassService = ClassService_1 = __decorate([
    ioc_1.ProvideSingleton(ClassService_1)
], ClassService);
exports.default = ClassService;
