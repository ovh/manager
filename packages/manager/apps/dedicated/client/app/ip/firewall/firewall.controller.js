export default class {
  /* @ngInject */
  constructor($scope, $state, $timeout, $translate, IpFirewall) {
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.IpFirewall = IpFirewall;
  }

  $onInit() {
    this.$scope.selectedBlock = null;
    this.$scope.selectedIp = null;
    this.$scope.rules = null;
    this.$scope.rulesLoading = false;
    this.$scope.rulesLoadingError = null;

    this.$scope.loadRules = (rulesCount, offset) => {
      if (this.$scope.selectedIp) {
        this.$scope.rulesLoading = true;

        this.IpFirewall.getFirewallRules(
          this.$scope.selectedBlock,
          this.$scope.selectedIp,
          rulesCount,
          offset,
        )
          .then(
            (rules) => {
              this.$scope.rules = rules;
              let options;

              if (
                this.$scope.rules &&
                this.$scope.rules.list &&
                this.$scope.rules.list.results &&
                this.$scope.rules.list.results.length
              ) {
                angular.forEach(this.$scope.rules.list.results, (result, i) => {
                  options = [];
                  if (result.fragments) {
                    options.push(
                      this.$translate.instant('ip_firewall_rule_fragments'),
                    );
                  }
                  if (result.tcpOption) {
                    options.push(result.tcpOption);
                  }

                  this.$scope.rules.list.results[i].options = options.join(
                    '<br/>',
                  );

                  // Go poll
                  if (
                    result.state === 'CREATION_PENDING' ||
                    result.state === 'REMOVAL_PENDING'
                  ) {
                    this.IpFirewall.pollFirewallRule(
                      this.$scope.selectedBlock,
                      this.$scope.selectedIp,
                      result.sequence,
                    ).then(() => {
                      this.reloadRules();
                    });
                  }
                });
              }
            },
            (reason) => {
              this.$scope.rulesLoadingError = reason.message;
            },
          )
          .finally(() => {
            this.$scope.rulesLoading = false;
          });
      }
    };

    this.$scope.hideFirewall = () => {
      this.IpFirewall.killPollFirewallRule();

      return this.goToDashboard(
        { serviceName: this.serviceName },
        { reload: true },
      );
    };

    return this.init();
  }

  init() {
    this.$scope.rulesLoadingError = null;
    this.$scope.rules = null;
    this.$scope.selectedBlock = this.ipBlock.ipBlock;
    this.$scope.selectedIp = this.ip.ip;
  }

  reloadRules() {
    this.IpFirewall.killPollFirewallRule();

    return this.$state.reload();
  }
}
