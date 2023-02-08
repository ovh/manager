export default /* @ngInject */ ($http, $timeout, iceberg) => ({
  getDocument(serviceName, from, to, batchId = null) {
    return $http({
      url: `/sms/${serviceName}/document`,
      method: 'GET',
      params: {
        batchID: batchId,
        'creationDatetime.from': from,
        'creationDatetime.to': to,
        wayType: 'outgoing',
      },
    }).then(({ data: documentId }) => {
      // 1. We need to poll to know if the size of the document is not empty.
      const tryGetDocument = () => {
        return $http
          .get(`/me/document/${documentId}`)
          .then(({ data: document }) => {
            if (document.size > 0) {
              // 2. Then we set a timeout to be sure that we have data.
              return $timeout(() => document, 5000);
            }
            return $timeout(tryGetDocument, 1000);
          });
      };
      return tryGetDocument().then((document) => {
        window.location.href = document.getUrl;
      });
    });
  },

  getAccountList() {
    return iceberg('/sms')
      .query()
      .expand('CachedObjectList-Pages')
      .sort('description', 'ASC')
      .execute(null, true)
      .$promise.then(({ data }) => data);
  },

  postCreditTransfer(serviceName, params) {
    return $http
      .post(`/sms/${serviceName}/transferCredits`, params)
      .then(({ data }) => data);
  },

  getSmppSettings(serviceName) {
    return $http
      .get(`/sms/${serviceName}/smpp/settings`)
      .then(({ data }) => data);
  },

  postResetSmppPassword(serviceName) {
    return $http
      .post(`/sms/${serviceName}/smpp/password`)
      .then(({ data }) => data);
  },

  getAllowedIps(serviceName) {
    return $http
      .get(`/sms/${serviceName}/smpp/allowedIPs`)
      .then(({ data }) => data);
  },

  putAllowedIps(serviceName, params) {
    return $http
      .put(`/sms/${serviceName}/smpp/allowedIPs`, params)
      .then(({ data }) => data);
  },
});
