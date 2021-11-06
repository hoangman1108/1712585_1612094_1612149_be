"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeCollection = exports.gradeSchema = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const assignment_model_1 = require("./assignment.model");
const toJSON_1 = require("./plugins/toJSON");
const user_model_1 = require("./user.model");
exports.gradeSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_model_1.UserCollection,
    },
    assignmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: assignment_model_1.AssignmentCollection,
    },
    score: {
        type: Number,
    },
    report: {
        type: String,
    },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });
exports.gradeSchema.plugin(toJSON_1.toJSON);
exports.GradeCollection = mongoose_1.model('Grades', exports.gradeSchema);
