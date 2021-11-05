import {
  Schema, Document, model, Model,
} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { toJSON } from './plugins/toJSON';
import { UserCollection } from './user.model';

interface ClassAttributes extends Document {
  id: string;
  name: string;
  teacher?: string;
  students: string[];
  codeJoin: string;
}

interface IClassModel extends Model<ClassAttributes> {
  paginate: any;
}

export const classSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  name: { type: String },
  teacher: { type: [Schema.Types.ObjectId], ref: UserCollection, required: false },
  codeJoin: { type: String },
  students: { type: [Schema.Types.ObjectId], ref: UserCollection },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });

classSchema.plugin(toJSON);

export const ClassCollection = model<ClassAttributes, IClassModel>('Classes', classSchema);
