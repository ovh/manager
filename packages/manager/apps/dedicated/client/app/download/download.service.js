class DownloadService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getBillUrl(billId, type, extension) {
    let realType = type;

    if (type === 'invoice') {
      // TODO: Bad idea : quickfix for US ... Remove it ASAP !!!
      realType = 'bill';
    }

    return this.$http
      .get(`apiv6/me/${realType}/${billId}/download?extension=${extension}`)
      .then(({ data }) => data);
  }
}

angular.module('Module.download').service('DownloadService', DownloadService);
