import {
  Schema, Document, model, Model,
} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { AssignmentCollection } from './assignment.model';
import { toJSON } from './plugins/toJSON';
import { UserCollection } from './user.model';

interface GradeAttributes extends Document {
  id: string;
  studentId: string;
  assignmentId: string;
  score: number;
  report: string;
}

interface IGradeModel extends Model<GradeAttributes> {
  paginate: any;
}

export const gradeSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: UserCollection,
  },
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: AssignmentCollection,
  },
  score: {
    type: Number,
  },
  report: {
    type: String,
  },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });

gradeSchema.plugin(toJSON);

export const GradeCollection = model<GradeAttributes, IGradeModel>('Grades', gradeSchema);
