export default class {
  /* @ngInject */
  constructor($scope, $translate, IpGameFirewall) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.IpGameFirewall = IpGameFirewall;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);

    this.loading = false;

    this.$scope.removeGameFirewallRule = () => {
      this.loading = true;

      this.IpGameFirewall.deleteRule(this.ipBlock, this.ip, this.rule.id)
        .then(() =>
          this.goBack(
            {
              message: {
                text: this.$translate.instant(
                  'ip_game_mitigation_rule_remove_success',
                ),
                data: 'OK',
              },
            },
            { reload: true },
          ),
        )
        .catch((data) =>
          this.goBack({
            message: {
              text: this.$translate.instant(
                'ip_game_mitigation_rule_remove_error',
              ),
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
