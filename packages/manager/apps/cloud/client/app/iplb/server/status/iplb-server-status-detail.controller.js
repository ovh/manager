class IpLoadBalancerServerStatusDetailCtrl {
  constructor($uibModalInstance, server) {
    this.$uibModalInstance = $uibModalInstance;
    this.server = server;
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module('managerApp').controller('IpLoadBalancerServerStatusDetailCtrl', IpLoadBalancerServerStatusDetailCtrl);
