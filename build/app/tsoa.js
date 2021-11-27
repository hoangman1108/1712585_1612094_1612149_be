"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerUi = __importStar(require("swagger-ui-express"));
const tsoa_1 = require("tsoa");
const logger_1 = __importDefault(require("./logger"));
const routes_1 = require("../routes/routes");
const utils_1 = __importDefault(require("./utils"));
const apiError_1 = __importDefault(require("../utils/apiError"));
class Tsoa {
    Init(App) {
        return __awaiter(this, void 0, void 0, function* () {
            routes_1.RegisterRoutes(App);
            const options = {
                explorer: true,
                customSiteTitle: 'Gateway API',
            };
            try {
                const swaggerDocument = require('../routes/swagger.json');
                if (utils_1.default.env === 'development') {
                    App.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
                }
                else {
                    App.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
                }
                App.use((err, req, res, next) => {
                    if (err instanceof tsoa_1.ValidateError) {
                        logger_1.default.warn(`Caught Validation Error for ${req.path}:`, err.fields);
                        return res.status(422).json({
                            message: 'Validation Failed',
                            details: err === null || err === void 0 ? void 0 : err.fields,
                        });
                    }
                    if (err instanceof apiError_1.default) {
                        const { statusCode, message } = err;
                        return res.status(statusCode).send({ message });
                    }
                    if (err instanceof Error) {
                        return res.status(500).send({
                            message: err.message,
                        });
                    }
                    next();
                });
            }
            catch (error) {
                logger_1.default.error('Unable to load swagger.json', error);
            }
        });
    }
}
exports.default = Tsoa;
