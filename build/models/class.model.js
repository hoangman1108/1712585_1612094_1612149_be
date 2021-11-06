"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassCollection = exports.classSchema = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const toJSON_1 = require("./plugins/toJSON");
const user_model_1 = require("./user.model");
exports.classSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
    },
    name: { type: String },
    teacher: { type: [mongoose_1.Schema.Types.ObjectId], ref: user_model_1.UserCollection, required: false },
    codeJoin: { type: String },
    students: { type: [mongoose_1.Schema.Types.ObjectId], ref: user_model_1.UserCollection },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });
exports.classSchema.plugin(toJSON_1.toJSON);
exports.ClassCollection = mongoose_1.model('Classes', exports.classSchema);
