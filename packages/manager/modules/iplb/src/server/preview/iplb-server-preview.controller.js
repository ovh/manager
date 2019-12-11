export default class IpLoadBalancerServerPreviewCtrl {
  /* @ngInject */
  constructor($uibModalInstance, server) {
    this.$uibModalInstance = $uibModalInstance;
    this.server = server;
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }
}
