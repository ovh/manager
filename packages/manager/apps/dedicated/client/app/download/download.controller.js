class DownloadCtrl {
  /* @ngInject */
  constructor($scope, $window, $q, $stateParams, Alerter, DownloadService) {
    this.$scope = $scope;
    this.$window = $window;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.Alerter = Alerter;
    this.DownloadService = DownloadService;
  }

  $onInit() {
    return this.openBillUrl();
  }

  openBillUrl() {
    return this.DownloadService.getBillUrl(
      this.$stateParams.id,
      this.$stateParams.type,
      this.$stateParams.extension,
    )
      .then((url) => this.$window.open(url, '_self'))
      .catch((err) => {
        this.Alerter.error(this.$translate.instant('download_bill_error'));
        return this.$q.reject(err);
      });
  }
}

angular.module('Module.download').controller('DownloadCtrl', DownloadCtrl);
