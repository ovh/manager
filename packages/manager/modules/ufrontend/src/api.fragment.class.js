import OvhMicroFrontendBaseAPI from './api.base.class';

class OvhMicroFrontendFragmentAPI extends OvhMicroFrontendBaseAPI {
  constructor(ufrontend, fragment) {
    super(ufrontend);
    this.fragment = fragment;
  }

  share(data) {
    this.ufrontend.shareFragmentData({
      fragment: this.fragment,
      data,
    });
  }
}

export default OvhMicroFrontendFragmentAPI;
