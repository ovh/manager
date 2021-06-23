import {
  OvhMicroFrontendBaseAPI as BaseApi,
  TimeoutObject,
} from './src/api.base.class';
import { Callback } from './src/utils/deferred.class';

export function emit(data: Record<string, unknown>, opts: TimeoutObject) {
  if (window.ovhMicroFrontend) {
    const api = new BaseApi(window.ovhMicroFrontend);
    return api.emit(data, opts);
  }
  return null;
}

export function listen(arg0: string | Callback, arg1?: Callback) {
  if (window.ovhMicroFrontend) {
    const api = new BaseApi(window.ovhMicroFrontend);
    return arg1 ? api.listen(arg0, arg1) : api.listen(arg0);
  }
  return function unbind() {};
}

export default {
  emit,
  listen,
};
