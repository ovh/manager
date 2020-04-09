export default class {
  /* @ngInject */
  constructor($scope, $translate, IpDashboardArp) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.IpDashboardArp = IpDashboardArp;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.loading = true;

    this.IpDashboardArp.getArpDetails(this.ipBlock.ipBlock, this.ip.ip)
      .then((details) => {
        this.$scope.details = details;
      })
      .finally(() => {
        this.$scope.loading = false;
      });

    this.$scope.unblockArp = () => {
      this.$scope.loading = true;

      this.IpDashboardArp.unblockIp(this.ipBlock.ipBlock, this.ip.ip)
        .then(() =>
          this.goBack(
            ({
              message: {
                text: this.$translate.instant('ip_arp_unblock_success'),
                data: 'OK',
              },
            },
            { reload: true }),
          ),
        )
        .catch((data) =>
          this.goBack({
            message: {
              text: this.$translate.instant('ip_arp_unblock_failure'),
              data: {
                ...data,
                type: 'ERROR',
              },
            },
          }),
        );
    };
  }
}
