"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentCollection = exports.assignmentSchema = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const toJSON_1 = require("./plugins/toJSON");
const user_model_1 = require("./user.model");
exports.assignmentSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
    },
    percent: {
        type: Number,
    },
    name: {
        type: String,
    },
    classId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Class',
    },
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_model_1.UserCollection,
    },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });
exports.assignmentSchema.plugin(toJSON_1.toJSON);
exports.AssignmentCollection = mongoose_1.model('Assignments', exports.assignmentSchema);
