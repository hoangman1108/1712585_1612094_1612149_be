/* eslint-disable func-names */
import bcrypt from 'bcrypt';
import {
  Schema, Document, model, Model,
} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { toJSON } from './plugins/toJSON';

export interface UserAttributes extends Document {
  id: string;
  name: string;
  dob: string;
  role: string;
  email: string;
  mssv?: string;
  phone?: string;
  password: string;
  passwordSalt?: string;
  facebook?: string;
  google?: string;
  comparePassword: ComparePasswordFunction;
}

interface IUserModel extends Model<UserAttributes> {
  paginate: any;
  isEmailTaken: (email: string, excludeUserId?: String) => Promise<boolean>;
}

type ComparePasswordFunction = (this: UserAttributes, candidatePassword: string, cb?: (err: Error, isMatch: boolean) => {}) => boolean;

export const userSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'teacher'],
    default: 'student',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  mssv: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordSalt: {
    type: String,
    required: false,
  },
  facebook: {
    type: String,
    required: false,
  },
  google: {
    type: String,
    required: false,
  },
}, { timestamps: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });

userSchema.plugin(toJSON);

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const user = this as UserAttributes;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this as UserAttributes;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt();
    user.passwordSalt = salt;
    user.password = await bcrypt.hash(user.password, user.passwordSalt);
  }
  next();
});

// check email exists
userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: String): Promise<boolean> {
  let condition: any = {
    email,
  };
  if (excludeUserId) {
    condition = {
      ...condition,
      _id: { $ne: excludeUserId },
    };
  }
  const user = await this.findOne(condition);
  return !!user;
};

// check mssv exists
userSchema.statics.isMssvTaken = async function (mssv: string, excludeUserId?: String): Promise<boolean> {
  let condition: any = {
    mssv,
  };
  if (excludeUserId) {
    condition = {
      ...condition,
      _id: { $ne: excludeUserId },
    };
  }
  const user = await this.findOne(condition);
  return !!user;
};

export const UserCollection = model<UserAttributes, IUserModel>('Users', userSchema);
