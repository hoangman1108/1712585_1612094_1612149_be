"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Events extends events_1.EventEmitter {
    connectDb() {
        this.emit('CONNECT_MONGO_SUCCESS');
    }
}
exports.default = new Events();
