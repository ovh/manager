class LogsOfferService {
  constructor($translate, CucControllerHelper, OvhApiDbaas, CucServiceHelper) {
    this.$translate = $translate;
    this.OvhApiDbaasLogsOffer = OvhApiDbaas.Logs().Offer().v6();
    this.CucServiceHelper = CucServiceHelper;
    this.CucControllerHelper = CucControllerHelper;
  }

  getOffer(serviceName) {
    return this.OvhApiDbaasLogsOffer.get({
      serviceName,
    }).$promise
      .catch((err) => this.LogsHelperService.handleError('logs_offer_load_error', err, {}));
  }

  getOfferDetail(offerCode) {
    return this.OvhApiDbaasLogsOffer.offerDetail({
      offerCode,
    }).$promise;
  }

  showWarning() {
    this.CucControllerHelper.modal.showWarningModal({
      title: this.$translate.instant('logs_offer_conflict_title'),
      message: this.$translate.instant('logs_offer_conflict_description'),
    });
  }
}

angular.module('managerApp').service('LogsOfferService', LogsOfferService);
