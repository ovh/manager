export default class {
  /* @ngInject */
  constructor($scope, $translate, Ip) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.Ip = Ip;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.loading = false;

    this.$scope.deleteIpBlock = () => {
      this.$scope.loading = true;

      return this.Ip.deleteIpBlock(this.ipBlock.ipBlock)
        .then(() =>
          this.goBack(
            {
              message: {
                text: this.$translate.instant(
                  'ip_table_manage_delete_ipblock_success',
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
                'ip_table_manage_delete_ipblock_failure',
                {
                  t0: this.ipBlock.ipBlock,
                },
              ),
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
