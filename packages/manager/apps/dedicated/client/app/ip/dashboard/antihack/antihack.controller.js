export default class {
  /* @ngInject */
  constructor($scope, $translate, IpDashboardAntihack) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.IpDashboardAntihack = IpDashboardAntihack;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.loading = true;

    this.IpDashboardAntihack.getAntihackDetails(
      this.ipBlock.ipBlock,
      this.ip.ip,
    )
      .then((details) => {
        this.$scope.details = details;
      })
      .finally(() => {
        this.$scope.loading = false;
      });

    this.$scope.unblockAntihack = () => {
      this.$scope.loading = true;
      this.IpDashboardAntihack.unblockIp(this.ipBlock.ipBlock, this.ip.ip)
        .then(() =>
          this.goBack({
            message: {
              text: this.$translate.instant('ip_antihack_unblock_success'),
              data: 'OK',
            },
          }),
        )
        .catch((data) =>
          this.goBack({
            message: {
              text: this.$translate.instant('ip_antihack_unblock_failure'),
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
