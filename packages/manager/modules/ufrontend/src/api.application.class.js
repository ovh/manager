import OvhMicroFrontendBaseAPI from './api.base.class';

class OvhMicroFrontendApplicationAPI extends OvhMicroFrontendBaseAPI {
  emit(data, opts) {
    this.ufrontend.emitMessage(
      {
        ...data,
        origin: 'application',
      },
      opts,
    );
  }
}

export default OvhMicroFrontendApplicationAPI;
