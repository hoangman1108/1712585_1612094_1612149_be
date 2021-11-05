import {
  Schema, Document, model, Model,
} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { toJSON } from './plugins/toJSON';

interface TokenAttributes extends Document {
  id: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
}

interface ITokenModel extends Model<TokenAttributes> {
  paginate: any;
}

export const tokenSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });

tokenSchema.plugin(toJSON);

export const TokenCollection = model<TokenAttributes, ITokenModel>('Tokens', tokenSchema);
