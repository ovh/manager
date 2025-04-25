export default class GdprService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getCapabilities() {
    return this.$http
      .get('/me/privacy/requests/capabilities', {
        serviceType: 'apiv6',
      })
      .then(({ data }) => data);
  }

  createErasureRequest() {
    return this.$http
      .post('/me/privacy/requests/erasure', null, {
        serviceType: 'apiv6',
      })
      .then(({ data }) => data);
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

  confirmErasure(requestPublicId, code) {
    return this.$http.post(
      `/me/privacy/requests/erasure/${requestPublicId}/confirm`,
      {
        code,
      },
      {
        serviceType: 'apiv6',
      },
    );
  }
}
