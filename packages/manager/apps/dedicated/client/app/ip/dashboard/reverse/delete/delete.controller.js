export default class {
  /* @ngInject */
  constructor($scope, $translate, IpDashboardReverse) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.IpDashboardReverse = IpDashboardReverse;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.ipBlock = this.ipBlock;
    this.$scope.reverse = this.reverse;

    /* Action */
    this.$scope.deleteIpv6ReverseDelegation = () => {
      return this.IpDashboardReverse.deleteDelegation(
        this.$scope.ipBlock.ipBlock,
        this.$scope.reverse,
      )
        .then(() =>
          this.goBack(
            {
              message: {
                text: this.$translate.instant(
                  'ip_table_manage_delegation_ipv6block_delete_success',
                ),
                data: 'OK',
              },
            },
            { reload: true },
          ),
        )
        .catch((err) =>
          this.goBack({
            message: {
              text: this.$translate.instant(
                'ip_table_manage_delegation_ipv6block_delete_err',
              ),
              data: {
                ...err,
                type: 'ERROR',
              },
            },
          }),
        );
    };
  }
}
