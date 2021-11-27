"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentCollection = exports.assignmentSchema = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const class_model_1 = require("./class.model");
const toJSON_1 = require("./plugins/toJSON");
const user_model_1 = require("./user.model");
exports.assignmentSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
    },
    score: {
        type: Number,
    },
    name: {
        type: String,
    },
    classId: {
        type: String,
        ref: class_model_1.ClassCollection,
    },
    teacherId: {
        type: String,
        ref: user_model_1.UserCollection,
    },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });
exports.assignmentSchema.plugin(toJSON_1.toJSON);
exports.AssignmentCollection = mongoose_1.model('Assignments', exports.assignmentSchema);
