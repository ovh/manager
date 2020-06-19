import EventEmitter from 'eventemitter3';
import getFrontend from './frontend';

const frontend = getFrontend();

class Messenger {
  constructor() {
    this.emitter = new EventEmitter();
  }

  static debug(message) {
    frontend.debug(`> messenger ${message}`);
  }

  on(id, message, callback) {
    Messenger.debug(`'${id}' on '${message}'`);
    this.emitter.on(message, callback);
  }

  emit(id, message, data) {
    return frontend.isLoaded().then(() => {
      Messenger.debug(`'${id}' emit '${message}'`);
      this.emitter.emit(message, {
        from: id,
        data,
      });
    });
  }
}

function getMessenger() {
  if (!window.ovhMicroFrontendMessenger) {
    window.ovhMicroFrontendMessenger = new Messenger();
  }
  return window.ovhMicroFrontendMessenger;
}

export default getMessenger;
