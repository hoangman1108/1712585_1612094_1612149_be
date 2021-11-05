import {
  Schema, Document, model, Model,
} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { toJSON } from './plugins/toJSON';
import { UserCollection } from './user.model';

interface AssignmentAttributes extends Document {
  id: string;
  percent: number;
  name: string;
  classId: string;
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
  percent: {
    type: Number,
  },
  name: {
    type: String,
  },
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: UserCollection,
  },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });

assignmentSchema.plugin(toJSON);

export const AssignmentCollection = model<AssignmentAttributes, IAssignmentModel>('Assignments', assignmentSchema);
