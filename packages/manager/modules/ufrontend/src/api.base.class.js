import { buildURL } from '../url-builder';

class OvhMicroFrontendBaseAPI {
  constructor(ufrontend) {
    this.ufrontend = ufrontend;
  }

  getEnvironment() {
    return this.ufrontend.environment;
  }

  // Temporary disable as it is planned to use Environment and pass it
  // eslint-disable-next-line class-methods-use-this
  buildURL(application, path, params) {
    return buildURL(application, path, params);
  }

  listen(arg0, arg1) {
    if (arg1) {
      const [listenId, callback] = [arg0, arg1];
      return this.ufrontend.addListener(({ id, ...data }) => {
        if (id === listenId) {
          callback(data);
        }
      });
    }
    const callback = arg0;
    return this.ufrontend.addListener(callback);
  }

  emit(data, opts) {
    return this.ufrontend.emitMessage(
      {
        ...data,
        origin: null,
      },
      opts,
    );
  }
}

export default OvhMicroFrontendBaseAPI;
