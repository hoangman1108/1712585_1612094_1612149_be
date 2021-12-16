import {
  Schema, Document, model,
} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { toJSON } from './plugins/toJSON';
import { ClassCollection } from './class.model';

interface StudentAttributes extends Document {
  id: string;
  list: any[];
  classId: string;
  name: string;
}
export const studentSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  list: {
    type: Array,
  },
  classId: {
    type: String,
    ref: ClassCollection,
  },
  name: {
    type: String,
  },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });

studentSchema.plugin(toJSON);

export const StudentCollection = model<StudentAttributes>('students', studentSchema);
