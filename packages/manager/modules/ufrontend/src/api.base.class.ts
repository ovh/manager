import OvhMicroFrontend from './framework.class';
import { Callback } from './utils/deferred.class';

export interface TimeoutObject {
  timeout: number;
}

export default class OvhMicroFrontendBaseAPI {
  ufrontend: OvhMicroFrontend;

  constructor(ufrontend: OvhMicroFrontend) {
    this.ufrontend = ufrontend;
  }

  listen(arg0: string | Callback, arg1?: Callback) {
    if (arg1) {
      const [listenId, callback] = [arg0 as string, arg1];
      return this.ufrontend.addListener(({ id, ...data }) => {
        if (id === listenId) {
          callback(data);
        }
      });
    }
    const callback = arg0 as Callback;
    return this.ufrontend.addListener(callback);
  }

  emit(data: Record<string, unknown>, timeout?: TimeoutObject) {
    return this.ufrontend.emitMessage(
      {
        ...data,
        origin: null,
      },
      timeout,
    );
  }
}
