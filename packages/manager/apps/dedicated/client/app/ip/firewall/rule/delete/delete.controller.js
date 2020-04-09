export default class {
  /* @ngInject */
  constructor($scope, $translate, IpFirewall) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.IpFirewall = IpFirewall;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);

    this.$scope.removeRule = () => {
      this.$scope.loading = true;

      this.IpFirewall.removeFirewallRule(
        this.ipBlock,
        this.ip,
        this.rule.sequence,
      )
        .then(() => this.goBack({}, { reload: true }))
        .catch((data) =>
          this.goBack({
            message: {
              text: this.$translate.instant('ip_firewall_remove_rule_fail'),
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
