export default /* @ngInject */ ($http, $timeout, $window) => ({
  getDocument(serviceName, from, to, batchId = null) {
    this.$window = $window;
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
        this.$window.location.href = document.getUrl;
      });
    });
  },
});
