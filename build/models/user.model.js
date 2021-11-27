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
exports.UserCollection = exports.userSchema = void 0;
/* eslint-disable func-names */
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const toJSON_1 = require("./plugins/toJSON");
exports.userSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
    },
    name: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'teacher'],
        default: 'student',
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    mssv: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    passwordSalt: {
        type: String,
        required: false,
    },
    facebook: {
        type: String,
        required: false,
    },
    google: {
        type: String,
        required: false,
    },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });
exports.userSchema.plugin(toJSON_1.toJSON);
exports.userSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        return bcrypt_1.default.compare(password, user.password);
    });
};
exports.userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified('password')) {
            const salt = yield bcrypt_1.default.genSalt();
            user.passwordSalt = salt;
            user.password = yield bcrypt_1.default.hash(user.password, user.passwordSalt);
        }
        next();
    });
});
// check email exists
exports.userSchema.statics.isEmailTaken = function (email, excludeUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        let condition = {
            email,
        };
        if (excludeUserId) {
            condition = Object.assign(Object.assign({}, condition), { _id: { $ne: excludeUserId } });
        }
        const user = yield this.findOne(condition);
        return !!user;
    });
};
// check mssv exists
exports.userSchema.statics.isMssvTaken = function (mssv, excludeUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        let condition = {
            mssv,
        };
        if (excludeUserId) {
            condition = Object.assign(Object.assign({}, condition), { _id: { $ne: excludeUserId } });
        }
        const user = yield this.findOne(condition);
        return !!user;
    });
};
exports.UserCollection = mongoose_1.model('Users', exports.userSchema);
