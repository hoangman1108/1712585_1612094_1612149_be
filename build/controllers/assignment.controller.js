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
var AssignmentController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentController = void 0;
const tsoa_1 = require("tsoa");
const ioc_1 = require("../inversify/ioc");
const assignment_service_1 = __importDefault(require("../services/assignment.service"));
let AssignmentController = AssignmentController_1 = class AssignmentController extends tsoa_1.Controller {
    constructor(assignmentService) {
        super();
        this.assignmentService = assignmentService;
    }
    getAssignments(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.assignmentService.list(data);
        });
    }
    getAssignment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.assignmentService.detail(id);
        });
    }
    createAssignment(request, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.assignmentService.create(Object.assign(Object.assign({}, data), { teacherId: request.user.userId }));
        });
    }
    updateAssignment(request, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.assignmentService.update(Object.assign(Object.assign({}, data), { id, teacherId: request.user.userId }));
        });
    }
    deleteAssignment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.assignmentService.delete(id);
        });
    }
};
__decorate([
    tsoa_1.Get(),
    tsoa_1.Security('oauth2')
], AssignmentController.prototype, "getAssignments", null);
__decorate([
    tsoa_1.Get('/{id}'),
    tsoa_1.Security('oauth2')
], AssignmentController.prototype, "getAssignment", null);
__decorate([
    tsoa_1.Post('/'),
    tsoa_1.Security('oauth2'),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Body())
], AssignmentController.prototype, "createAssignment", null);
__decorate([
    tsoa_1.Put('/{id}'),
    tsoa_1.Security('oauth2'),
    __param(0, tsoa_1.Request()), __param(2, tsoa_1.Body())
], AssignmentController.prototype, "updateAssignment", null);
__decorate([
    tsoa_1.Delete('/{id}'),
    tsoa_1.Security('oauth2')
], AssignmentController.prototype, "deleteAssignment", null);
AssignmentController = AssignmentController_1 = __decorate([
    tsoa_1.Tags('Assignments'),
    tsoa_1.Route('/assignments'),
    ioc_1.ProvideSingleton(AssignmentController_1),
    __param(0, ioc_1.inject(assignment_service_1.default))
], AssignmentController);
exports.AssignmentController = AssignmentController;
