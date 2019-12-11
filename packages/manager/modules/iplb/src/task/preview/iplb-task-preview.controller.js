export default class IpLoadBalancerTaskPreviewCtrl {
  /* @ngInject */
  constructor($uibModalInstance, task) {
    this.$uibModalInstance = $uibModalInstance;
    this.task = task;
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }
}
