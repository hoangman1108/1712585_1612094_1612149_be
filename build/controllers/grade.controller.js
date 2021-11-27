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
var GradeController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeController = void 0;
const tsoa_1 = require("tsoa");
const ioc_1 = require("../inversify/ioc");
const grade_service_1 = __importDefault(require("../services/grade.service"));
let GradeController = GradeController_1 = class GradeController extends tsoa_1.Controller {
    constructor(gradeService) {
        super();
        this.gradeService = gradeService;
    }
    getGrades() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gradeService.list();
        });
    }
    getGrade(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gradeService.detail(id);
        });
    }
    createGrade(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gradeService.create(data);
        });
    }
    updateGrade(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gradeService.update(Object.assign(Object.assign({}, data), { id }));
        });
    }
    deleteGrade(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gradeService.delete(id);
        });
    }
};
__decorate([
    tsoa_1.Get(),
    tsoa_1.Security('oauth2')
], GradeController.prototype, "getGrades", null);
__decorate([
    tsoa_1.Get('/{id}'),
    tsoa_1.Security('oauth2')
], GradeController.prototype, "getGrade", null);
__decorate([
    tsoa_1.Post('/'),
    tsoa_1.Security('oauth2'),
    __param(0, tsoa_1.Body())
], GradeController.prototype, "createGrade", null);
__decorate([
    tsoa_1.Put('/{id}'),
    tsoa_1.Security('oauth2'),
    __param(1, tsoa_1.Body())
], GradeController.prototype, "updateGrade", null);
__decorate([
    tsoa_1.Delete('/{id}'),
    tsoa_1.Security('oauth2')
], GradeController.prototype, "deleteGrade", null);
GradeController = GradeController_1 = __decorate([
    tsoa_1.Tags('Grades'),
    tsoa_1.Route('/grades'),
    ioc_1.ProvideSingleton(GradeController_1),
    __param(0, ioc_1.inject(grade_service_1.default))
], GradeController);
exports.GradeController = GradeController;
