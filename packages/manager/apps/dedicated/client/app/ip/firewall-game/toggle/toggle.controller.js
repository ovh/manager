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

    this.$scope.enableDisableGameFirewallRule = () => {
      this.loading = true;

      this.IpGameFirewall.putFirewall(
        this.ipBlock,
        this.ip,
        !this.firewall.firewallModeEnabled,
      )
        .then(() =>
          this.goBack(
            {
              message: {
                text: this.$translate.instant(
                  `ip_game_mitigation_firewall_enable_success_${this.firewall.firewallModeEnabled}`,
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
                `ip_game_mitigation_firewall_enable_error_${this.firewall.firewallModeEnabled}`,
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
