export default class {
  /* @ngInject */
  constructor($scope, $translate, Ip, IpDashboardVirtualMac) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.Ip = Ip;
    this.IpDashboardVirtualMac = IpDashboardVirtualMac;
  }

  $onInit() {
    this.$scope.model = {
      choice: 'new',
    };

    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.loading = true;

    this.$scope.existingVirtualMacs = [];

    if (
      this.ipBlock.service.virtualmac &&
      this.ipBlock.service.virtualmac.virtualMacs
    ) {
      angular.forEach(
        this.ipBlock.service.virtualmac.virtualMacs,
        (ips, virtualmac) => {
          if (ips.length && !~ips.indexOf(this.ip.ip)) {
            this.$scope.existingVirtualMacs.push(virtualmac);
          }
        },
      );
    }

    this.Ip.getServerModels().then((models) => {
      this.$scope.types = models['dedicated.server.VmacTypeEnum'].enum;
      this.$scope.loading = false;
    });

    /* Action */

    this.$scope.addVirtualMac = () => {
      this.$scope.loading = true;
      if (this.$scope.model.choice === 'new') {
        this.IpDashboardVirtualMac.addVirtualMacToIp(
          this.serviceName,
          this.ip.ip,
          this.$scope.model.type,
          this.$scope.model.virtualMachineName,
        )
          .then(() =>
            this.goBack(
              {
                message: {
                  text: this.$translate.instant(
                    'ip_virtualmac_add_new_success',
                    {
                      t0: this.ip.ip,
                    },
                  ),
                  data: 'OK',
                },
              },
              { reload: true },
            ),
          )
          .catch((reason) =>
            this.goBack({
              message: {
                text: this.$translate.instant('ip_virtualmac_add_new_failure', {
                  t0: this.ip.ip,
                }),
                data: {
                  ...reason,
                  type: 'ERROR',
                },
              },
            }),
          );
      } else {
        this.IpDashboardVirtualMac.addIpToVirtualMac(
          this.serviceName,
          this.$scope.model.macAddress,
          this.ip.ip,
          this.$scope.model.virtualMachineName,
        )
          .then(() =>
            this.goBack(
              {
                message: {
                  text: this.$translate.instant(
                    'ip_virtualmac_add_existing_success',
                    {
                      t0: this.ip.ip,
                    },
                  ),
                  data: 'OK',
                },
              },
              { reload: true },
            ),
          )
          .catch((reason) =>
            this.goBack({
              message: {
                text: this.$translate.instant(
                  'ip_virtualmac_add_existing_failure',
                  {
                    t0: this.ip.ip,
                  },
                ),
                data: {
                  ...reason,
                  type: 'ERROR',
                },
              },
            }),
          );
      }
    };

    this.$scope.isValid = () => {
      switch (this.$scope.model.choice) {
        case 'new':
          return this.$scope.model.type && this.$scope.model.virtualMachineName;
        case 'existing':
          return (
            this.$scope.model.macAddress && this.$scope.model.virtualMachineName
          );
        default:
          return false;
      }
    };
  }
}
