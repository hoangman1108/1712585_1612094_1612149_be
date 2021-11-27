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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tsoa_1 = require("tsoa");
const ioc_1 = require("../inversify/ioc");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_service_1 = __importDefault(require("../services/auth.service"));
const auth_validate_1 = require("../validations/auth.validate");
let AuthController = AuthController_1 = class AuthController extends tsoa_1.Controller {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.authService.login(data.username, data.password);
        });
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            validate_middleware_1.validateMiddleware(auth_validate_1.registerSchema, data);
            const message = yield this.authService.register(data);
            return { message };
        });
    }
    changePassword(data, request) {
        return __awaiter(this, void 0, void 0, function* () {
            validate_middleware_1.validateMiddleware(auth_validate_1.changePasswordSchema, data);
            const message = yield this.authService.changePassword(Object.assign(Object.assign({}, data), { userId: request.user.userId }));
            return {
                message,
            };
        });
    }
};
__decorate([
    tsoa_1.Post('/login'),
    __param(0, tsoa_1.Body())
], AuthController.prototype, "login", null);
__decorate([
    tsoa_1.Post('/signup'),
    __param(0, tsoa_1.Body())
], AuthController.prototype, "register", null);
__decorate([
    tsoa_1.Post('/change-password'),
    tsoa_1.Security('oauth2'),
    __param(0, tsoa_1.Body()), __param(1, tsoa_1.Request())
], AuthController.prototype, "changePassword", null);
AuthController = AuthController_1 = __decorate([
    tsoa_1.Tags('Auth'),
    tsoa_1.Route('/auth'),
    ioc_1.ProvideSingleton(AuthController_1),
    __param(0, ioc_1.inject(auth_service_1.default))
], AuthController);
exports.AuthController = AuthController;
