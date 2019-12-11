export default class IpLoadBalancerFrontendPreviewCtrl {
  /* @ngInject */
  constructor($uibModalInstance, frontend) {
    this.$uibModalInstance = $uibModalInstance;
    this.frontend = frontend;
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }
}
