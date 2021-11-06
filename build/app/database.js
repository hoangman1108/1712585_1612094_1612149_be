"use strict";
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
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = __importDefault(require("./utils"));
const logger_1 = __importDefault(require("./logger"));
const eventEmitter_1 = __importDefault(require("./eventEmitter"));
class Database {
    constructor() {
        this.uri = `mongodb://${utils_1.default.mongo.user}:${encodeURIComponent(utils_1.default.mongo.pass)}@${utils_1.default.mongo.host}:${utils_1.default.mongo.port}/${utils_1.default.mongo.db}`;
        this.onConnection();
    }
    onConnection() {
        this.connection = mongoose_1.default.connection;
        this.connection.on('connected', () => {
            logger_1.default.info('Mongo Connection Established');
            eventEmitter_1.default.connectDb();
        });
        this.connection.on('reconnected', () => {
            logger_1.default.info('Mongo Connection Reestablished');
        });
        this.connection.on('disconnected', () => {
            logger_1.default.info('Mongo Connection Disconnected');
            logger_1.default.info('Trying to reconnect to Mongo...');
            setTimeout(() => {
                mongoose_1.default.connect(this.uri, {
                    keepAlive: true,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    socketTimeoutMS: 3000,
                    connectTimeoutMS: 3000,
                    useCreateIndex: true,
                    useFindAndModify: false,
                    authSource: 'admin',
                    replicaSet: 'rs0',
                });
            }, 3000);
        });
        this.connection.on('close', () => {
            logger_1.default.info('Mongo Connection Closed');
        });
        this.connection.on('error', (error) => {
            logger_1.default.info(`Mongo Connection Error:${error}`);
        });
        const run = () => __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.connect(this.uri, {
                keepAlive: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
                authSource: 'admin',
            });
        });
        run().catch((error) => logger_1.default.error(error));
    }
}
exports.default = Database;
