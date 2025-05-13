import { TERMINATE_PATTERN } from './constants';

export default class IpLoadBalancerTerminateCtrl {
  /* @ngInject */
  constructor(
    $http,
    $translate,
    $uibModalInstance,
    service,
    CucControllerHelper,
    Alerter,
  ) {
    this.$uibModalInstance = $uibModalInstance;
    this.service = service;
    this.CucControllerHelper = CucControllerHelper;
    this.TERMINATE_PATTERN = TERMINATE_PATTERN;
    this.$translate = $translate;
    this.$http = $http;
    this.Alerter = Alerter;
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }

  terminate() {
    this.$http
      .post(`/ipLoadbalancing/${this.service.serviceName}/terminate`)
      .then(() => {
        this.Alerter.success(
          this.$translate.instant('iplb_terminate_service_success'),
          'InfoErrors',
        );
      })
      .catch((err) => {
        this.Alerter.error(
          this.$translate.instant('iplb_terminate_service_error', {
            t0: err.data ? err.data.message : err.message,
          }),
          'InfoErrors',
        );
      });
    this.$uibModalInstance.close();
  }

  close() {
    this.$uibModalInstance.close();
  }
}
