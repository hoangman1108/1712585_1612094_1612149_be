import {
  Schema, Document, model, Model,
} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { toJSON } from './plugins/toJSON';
import { UserCollection } from './user.model';

interface AssignmentAttributes extends Document {
  name: string;
  score: number;
  teacherId: string;
}

interface IAssignmentModel extends Model<AssignmentAttributes> {
  paginate: any;
}

export const assignmentSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  score: {
    type: Number,
  },
  name: {
    type: String,
  },
  teacherId: {
    type: String,
    ref: UserCollection,
  },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });

assignmentSchema.plugin(toJSON);

assignmentSchema.index({ name: 'text' });

export const AssignmentCollection = model<AssignmentAttributes, IAssignmentModel>('Assignments', assignmentSchema);
