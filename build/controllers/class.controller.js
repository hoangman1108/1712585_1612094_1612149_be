"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var ClassController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassController = void 0;
const tsoa_1 = require("tsoa");
const ioc_1 = require("../inversify/ioc");
const class_service_1 = __importDefault(require("../services/class.service"));
let ClassController = ClassController_1 = class ClassController extends tsoa_1.Controller {
    constructor(classService) {
        super();
        this.classService = classService;
    }
    getClasses() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.classService.list();
        });
    }
    getDetailClass(classId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.classService.detailFullFill(classId);
        });
    }
    checkUserInClass(request, classId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.classService.checkUserInClass(classId, request.user.userId);
        });
    }
    createClass(request, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.classService.create(data);
        });
    }
    addStudent(request, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.classService.addStudent(data);
        });
    }
    addTeacher(request, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.classService.addTeacher(data);
        });
    }
    deleteClass(classId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.classService.delete(classId);
        });
    }
    joinClass(request, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.classService.joinClass(data);
        });
    }
};
__decorate([
    tsoa_1.Get('/'),
    tsoa_1.Security('oauth2')
], ClassController.prototype, "getClasses", null);
__decorate([
    tsoa_1.Get('/{classId}'),
    tsoa_1.Security('oauth2')
], ClassController.prototype, "getDetailClass", null);
__decorate([
    tsoa_1.Get('/{classId}/checkUser'),
    tsoa_1.Security('oauth2'),
    __param(0, tsoa_1.Request())
], ClassController.prototype, "checkUserInClass", null);
__decorate([
    tsoa_1.Post('/'),
    tsoa_1.Security('oauth2'),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Body())
], ClassController.prototype, "createClass", null);
__decorate([
    tsoa_1.Post('/addStudent'),
    tsoa_1.Security('oauth2'),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Body())
], ClassController.prototype, "addStudent", null);
__decorate([
    tsoa_1.Post('/addTeacher'),
    tsoa_1.Security('oauth2'),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Body())
], ClassController.prototype, "addTeacher", null);
__decorate([
    tsoa_1.Delete('/{classId}'),
    tsoa_1.Security('oauth2')
], ClassController.prototype, "deleteClass", null);
__decorate([
    tsoa_1.Post('/joinClass'),
    tsoa_1.Security('oauth2'),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Body())
], ClassController.prototype, "joinClass", null);
ClassController = ClassController_1 = __decorate([
    tsoa_1.Route('/classes'),
    tsoa_1.Tags('Classes'),
    ioc_1.ProvideSingleton(ClassController_1),
    __param(0, ioc_1.inject(class_service_1.default))
], ClassController);
exports.ClassController = ClassController;
