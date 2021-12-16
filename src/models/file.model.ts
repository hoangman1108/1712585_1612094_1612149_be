import mongoose from 'mongoose';

export type IFile = mongoose.Document & {
  path: string;
  type: string;
  size: number;
  name: string;
  signed: boolean;
};

const fileSchema = new mongoose.Schema({
  path: { type: String },
  type: { type: String },
  name: { type: String },
  signed: { type: Boolean },
  size: Number,
});

const FileCollection = mongoose.model<IFile>('file', fileSchema);

export default FileCollection;
