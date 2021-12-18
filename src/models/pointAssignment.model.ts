import mongoose from 'mongoose';
import { AssignmentCollection } from './assignment.model';
import { ClassCollection } from './class.model';

export type IPointAssingment = mongoose.Document & {
  classId: string;
  mssv: string;
  fullName: string;
  assignmentId: string;
  point?: number;
};

const pointAssignment = new mongoose.Schema({
  classId: {
    type: String,
    ref: ClassCollection,
  },
  mssv: {
    type: String,
  },
  fullName: {
    type: String,
  },
  assignmentId: {
    type: String,
    ref: AssignmentCollection,
  },
  point: {
    type: Number,
    nullable: true,
  },
});

const PointAssignmentCollection = mongoose.model<IPointAssingment>('pointAssignment', pointAssignment);

export default PointAssignmentCollection;
