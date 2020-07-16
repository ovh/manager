import OvhMicroFrontendBaseAPI from './api.base.class';

class OvhMicroFrontendApplicationAPI extends OvhMicroFrontendBaseAPI {
  share(data) {
    this.ufrontend.shareApplicationData(data);
  }
}

export default OvhMicroFrontendApplicationAPI;
