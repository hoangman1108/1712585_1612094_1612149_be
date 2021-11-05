import { EventEmitter } from 'events';

class Events extends EventEmitter {
  connectDb() {
    this.emit('CONNECT_MONGO_SUCCESS');
  }
}

export default new Events();
