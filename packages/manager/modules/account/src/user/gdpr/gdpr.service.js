// TODO: remove these once we are able to go to prod
const API_BASE_ROUTE = 'http://gw2sdev-docker.ovh.net:14975/v1';
const createHeaders = (nic) => ({
  'X-Ovh-Nic': nic,
});

export default class GdprService {
  /* @ngInject */
  constructor($http, coreConfig) {
    this.$http = $http;
    this.headers = createHeaders(coreConfig.getUser()?.nichandle);
  }

  getCapabilities() {
    return this.$http
      .get(`${API_BASE_ROUTE}/me/privacy/requests/capabilities`, {
        headers: this.headers,
      })
      .then(({ data }) => data);
  }

  createErasureRequest() {
    return this.$http
      .post(`${API_BASE_ROUTE}/me/privacy/requests/erasure`, null, {
        headers: this.headers,
      })
      .then(({ data }) => data);
  }
}
