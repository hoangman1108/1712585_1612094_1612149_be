import {
  Schema, Document, model,
} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { toJSON } from './plugins/toJSON';
import { UserCollection } from './user.model';

interface AssignmentCheckedAttributes extends Document {
  assignmentId: string;
  checked: boolean;
  studentId: string;
}

export const assignmentCheckedSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  assignmentId: {
    type: String,
  },
  studentId: {
    type: String,
    ref: UserCollection,
  },
  checked: {
    type: Boolean,
    default: false,
  },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });

assignmentCheckedSchema.plugin(toJSON);

assignmentCheckedSchema.index({ name: 'text' });

export const AssignmentCheckedCollection = model<AssignmentCheckedAttributes>('AssignmentsChecked', assignmentCheckedSchema);
