import {
  Schema, Document, model, Model,
} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { toJSON } from './plugins/toJSON';
import { UserCollection } from './user.model';
import { IComment, MarkEnum } from '../interfaces/gradeView.interface';
import { ClassCollection } from './class.model';
import { AssignmentCollection } from './assignment.model';

interface GradeViewAttributes extends Document {
  id?: string;
  classId: string;
  studentId: string;
  Mssv: string;
  composition: string;
  current: number;
  expect: number;
  explanation: string;
  comments?: IComment[];
  mark: MarkEnum;
}

interface IGradeViewModel extends Model<GradeViewAttributes> {
  paginate: any;
}

export const gradeViewSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  classId: {
    type: String,
    ref: ClassCollection,
  },
  studentId: {
    type: String,
    ref: UserCollection,
  },
  Mssv: {
    type: String,
  },
  composition: {
    type: String,
    ref: AssignmentCollection,
  },
  explanation: {
    type: String,
  },
  current: {
    type: Number,
  },
  expect: {
    type: Number,
  },
  comments: {
    type: [{
      userId: String,
      role: String,
      comment: String,
    }],
    nullable: true,
  },
  mark: {
    type: String,
    required: true,
    enum: [MarkEnum.ACCEPT, MarkEnum.PROCESSING, MarkEnum.REJECT],
    default: MarkEnum.PROCESSING,
  },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });

gradeViewSchema.plugin(toJSON);

gradeViewSchema.index({ name: 'text' });

export const GradeViewCollection = model<GradeViewAttributes, IGradeViewModel>('gradeView', gradeViewSchema);
