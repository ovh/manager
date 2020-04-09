export default class {
  /* @ngInject */
  constructor($scope, $translate, IpDashboardReverse, Validator) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.IpDashboardReverse = IpDashboardReverse;
    this.Validator = Validator;
  }

  $onInit() {
    this.$scope.model = { ipv6: null, reverse: null };

    /* Action */

    this.$scope.addIpv6 = () => {
      return this.IpDashboardReverse.updateReverse(
        this.ipBlock,
        this.$scope.model.ipv6,
        this.$scope.model.reverse,
      )
        .then(() => this.goBack({}, { reload: true }))
        .catch((reason) =>
          this.goBack({
            message: {
              text: this.$translate.instant(
                'ip_table_manage_add_ipv6block_failure',
              ),
              data: {
                ...reason,
                type: 'ERROR',
              },
            },
          }),
        );
    };

    this.$scope.isValid = {
      ipv6: () => this.Validator.isValidIpv6(this.$scope.model.ipv6),
      reverse: () =>
        this.Validator.isValidDomain(
          this.$scope.model.reverse.replace(/\.$/, ''),
        ),
      all: () => this.$scope.isValid.ipv6() && this.$scope.isValid.reverse(),
    };
  }
}
