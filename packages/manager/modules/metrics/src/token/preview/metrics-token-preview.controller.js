export default class MetricsTokenPreviewCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $uibModalInstance,
    serviceName,
    tokenID,
    MetricService,
  ) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.serviceName = serviceName;
    this.tokenID = tokenID;
    this.MetricService = MetricService;

    this.token = {};
    this.loading = false;
  }

  $onInit() {
    this.loading = true;
    this.MetricService.getToken(this.serviceName, this.tokenID)
      .then((data) => {
        this.token = data;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  close() {
    this.$uibModalInstance.dismiss();
  }

  static displayDate(date) {
    return moment(date).format('LLL');
  }

  getTokenState(token) {
    if (!token) {
      return '';
    }
    if (token.isRevoked) {
      return this.$translate.instant('metrics_token_state_inactive');
    }
    return this.$translate.instant('metrics_token_state_active');
  }
}
