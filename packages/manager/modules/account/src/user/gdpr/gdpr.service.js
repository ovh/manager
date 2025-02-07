// TODO: clean this file of API_BASE_ROUTE and createHeaders once we're ready to prod
// they are used to access a DEV version of the API used to do our tests in local
// eslint-disable-next-line no-unused-vars
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
    return (
      this.$http
        // .get(`${API_BASE_ROUTE}/me/privacy/requests/capabilities`, {
        .get('/me/privacy/requests/capabilities', {
          // headers: this.headers,
          serviceType: 'apiv6',
        })
        .then(({ data }) => data)
    );
  }

  createErasureRequest() {
    return (
      this.$http
        // .post(`${API_BASE_ROUTE}/me/privacy/requests/erasure`, null, {
        .post('/me/privacy/requests/erasure', null, {
          // headers: this.headers,
          serviceType: 'apiv6',
        })
        .then(({ data }) => data)
    );
  }

  getRequests() {
    return this.$http
      .get('/me/privacy/requests', {
        serviceType: 'apiv6',
      })
      .then(({ data }) => data);
  }

  cancelRequestErasure(requestPublicId) {
    return this.$http
      .post(`/me/privacy/requests/erasure/${requestPublicId}/cancel`, null, {
        serviceType: 'apiv6',
      })
      .then(({ data }) => data);
  }

  sendErasureRequestConfirmationEmail(requestPublicId) {
    return this.$http
      .post(
        `/me/privacy/requests/erasure/${requestPublicId}/confirmationEmail`,
        null,
        {
          serviceType: 'apiv6',
        },
      )
      .then(({ data }) => data);
  }
}
