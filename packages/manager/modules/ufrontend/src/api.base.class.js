class OvhMicroFrontendBaseAPI {
  constructor(ufrontend) {
    this.ufrontend = ufrontend;
  }

  get(id, timeout = 30) {
    if (id === 'application') {
      return this.ufrontend.getApplicationSharedData(timeout).then((data) => ({
        ...data,
      }));
    }
    return this.ufrontend.getFragmentSharedData(id, timeout).then((data) => ({
      ...data,
    }));
  }

  share() {
    throw new Error(`Unimplemented method OvhMicroFrontendBaseAPI.share`, this);
  }
}

export default OvhMicroFrontendBaseAPI;
