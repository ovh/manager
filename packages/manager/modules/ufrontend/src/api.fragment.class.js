import OvhMicroFrontendBaseAPI from './api.base.class';

class OvhMicroFrontendFragmentAPI extends OvhMicroFrontendBaseAPI {
  constructor(ufrontend, fragment) {
    super(ufrontend);
    this.fragment = fragment;
  }

  emit(data, opts) {
    this.ufrontend.emitMessage(
      {
        ...data,
        origin: this.fragment.id,
      },
      opts,
    );
  }
}

export default OvhMicroFrontendFragmentAPI;
