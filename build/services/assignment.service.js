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
var AssignmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const ioc_1 = require("../inversify/ioc");
const assignment_model_1 = require("../models/assignment.model");
const utils_1 = require("../utils");
let AssignmentService = AssignmentService_1 = class AssignmentService {
    list(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = {};
            if (data.classId) {
                find.classId = data.classId;
            }
            if (data.name) {
                find.name = data.name;
            }
            const assignments = yield assignment_model_1.AssignmentCollection.find(data);
            return assignments;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield assignment_model_1.AssignmentCollection.findOne({ name: data.name, classId: data.classId });
            if (find) {
                throw new utils_1.ApiError(http_status_1.default.FOUND, 'NAME_ASSIGNMENT_FOUND_IN_CLASS');
            }
            const assignment = yield assignment_model_1.AssignmentCollection.create(data);
            return assignment;
        });
    }
    detail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignment = yield assignment_model_1.AssignmentCollection.findById(id);
            if (!assignment) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'ASSIGNMENT_NOT_FOUND');
            }
            return assignment;
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignment = yield assignment_model_1.AssignmentCollection.findByIdAndUpdate(data.id, data);
            if (!assignment) {
                throw new utils_1.ApiError(http_status_1.default.NOT_FOUND, 'ASSIGNMENT_NOT_FOUND');
            }
            return assignment;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield assignment_model_1.AssignmentCollection.deleteOne({ _id: id });
            if (deleted.ok && deleted.n) {
                return 'DELETED';
            }
            throw new utils_1.ApiError(http_status_1.default.BAD_REQUEST, 'DELETE_CLASS_FAIL');
        });
    }
};
AssignmentService = AssignmentService_1 = __decorate([
    ioc_1.ProvideSingleton(AssignmentService_1)
], AssignmentService);
exports.default = AssignmentService;
