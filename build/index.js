"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const tsoa_1 = __importDefault(require("./app/tsoa"));
const logger_1 = __importDefault(require("./app/logger"));
const database_1 = __importDefault(require("./app/database"));
const utils_1 = __importDefault(require("./app/utils"));
const eventEmitter_1 = __importDefault(require("./app/eventEmitter"));
const email_connect_1 = require("./helpers/email.connect");
class Server {
    constructor() {
        this.App = express_1.default();
        // eslint-disable-next-line no-new
        new database_1.default();
        this.tsoa = new tsoa_1.default();
        this.Middleware();
        email_connect_1.ConnectMailer();
    }
    Middleware() {
        this.App.use(cors_1.default({
            origin: '*',
            credentials: false,
        }));
        this.App.use(cookie_parser_1.default('secret'));
        this.App.use(express_1.default.json());
        this.App.use(morgan_1.default('dev'));
        this.App.use(express_1.default.urlencoded({ extended: true }));
    }
    Start() {
        this.tsoa.Init(this.App);
        eventEmitter_1.default.on('CONNECT_MONGO_SUCCESS', () => {
            this.App.listen(process.env.PORT || 4000, () => {
                logger_1.default.info(`Api is now running on  ${utils_1.default.AppHost}:${utils_1.default.AppPort}/api/v1`);
                logger_1.default.info(`Docs is now running on ${utils_1.default.AppHost}:${utils_1.default.AppPort}/v1/docs`);
            });
        });
    }
}
new Server().Start();
