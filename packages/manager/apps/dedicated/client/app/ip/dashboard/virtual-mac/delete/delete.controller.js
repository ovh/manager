export default class {
  /* @ngInject */
  constructor($scope, $translate, IpDashboardVirtualMac) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.IpDashboardVirtualMac = IpDashboardVirtualMac;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);

    this.$scope.deleteVirtualMac = () => {
      this.$scope.loading = true;
      this.IpDashboardVirtualMac.deleteVirtualMac(
        this.serviceName,
        this.ipBlock.service.virtualmac.virtualMacsByIp[this.ip.ip],
        this.ip.ip,
      )
        .then(() =>
          this.goBack(
            {
              message: {
                text: this.$translate.instant('ip_virtualmac_delete_success', {
                  t0: this.ipBlock.service.virtualmac.virtualMacsByIp[
                    this.ip.ip
                  ],
                  t1: this.ip.ip,
                }),
                data: 'OK',
              },
            },
            { reload: true },
          ),
        )
        .catch((reason) =>
          this.goBack({
            message: {
              text: this.$translate.instant('ip_virtualmac_delete_failure', {
                t0: this.ipBlock.service.virtualmac.virtualMacsByIp[this.ip.ip],
                t1: this.ip.ip,
              }),
              data: {
                ...reason,
                type: 'ERROR',
              },
            },
          }),
        );
    };
  }
}
