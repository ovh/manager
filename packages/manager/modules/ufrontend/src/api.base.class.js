class OvhMicroFrontendBaseAPI {
  constructor(ufrontend) {
    this.ufrontend = ufrontend;
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
