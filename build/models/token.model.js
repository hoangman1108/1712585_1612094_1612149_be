"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenCollection = exports.tokenSchema = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const toJSON_1 = require("./plugins/toJSON");
exports.tokenSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });
exports.tokenSchema.plugin(toJSON_1.toJSON);
exports.TokenCollection = mongoose_1.model('Tokens', exports.tokenSchema);
