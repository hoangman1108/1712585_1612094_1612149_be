import httpStatus from 'http-status';
import { IClass } from '../interfaces/class.interface';
import { ProvideSingleton } from '../inversify/ioc';
import { ClassCollection } from '../models/class.model';
import { ApiError } from '../utils';

@ProvideSingleton(ClassService)
export default class ClassService {
  async list(): Promise<IClass[]> {
    const classes: IClass[] = await ClassCollection.find();
    return classes;
  }

  async create(data: IClass): Promise<IClass> {
    const created = await ClassCollection.create(data);
    if (!created) {
      throw new ApiError(httpStatus.NOT_FOUND, 'CANNOT_CREATE_CLASS');
    }
    return created;
  }

  async delete(id: string): Promise<string> {
    const deleted = await ClassCollection.deleteOne({ _id: id });
    if (deleted.ok && deleted.n) {
      return 'DELETED';
    }

    throw new ApiError(httpStatus.BAD_REQUEST, 'DELETE_CLASS_FAIL');
  }
}
