import BaseApi from './src/api.base.class';

export function emit(data, opts) {
  if (window.ovhMicroFrontend) {
    const api = new BaseApi(window.ovhMicroFrontend);
    return api.emit(data, opts);
  }
  return null;
}

export function listen(...args) {
  if (window.ovhMicroFrontend) {
    const api = new BaseApi(window.ovhMicroFrontend);
    return api.listen(...args);
  }
  return function unbind() {};
}

export default {
  emit,
  listen,
};
