export default class {
  /* @ngInject */
  constructor($scope, IpDashboardVirtualMac) {
    this.$scope = $scope;
    this.IpDashboardVirtualMac = IpDashboardVirtualMac;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.loading = true;

    this.IpDashboardVirtualMac.getVirtualMacDetails(
      this.serviceName,
      this.ipBlock.service.virtualmac.virtualMacsByIp[this.ip.ip],
      this.ip.ip,
    )
      .then((details) => {
        this.$scope.details = details;
      })
      .finally(() => {
        this.$scope.loading = false;
      });
  }
}
