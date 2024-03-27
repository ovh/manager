angular.module('App').controller(
  'DomainDynHostEditCtrl',
  class DomainDynHostEditCtrl {
    constructor($scope, $translate, Alerter, Domain, WucValidator) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
      this.WucValidator = WucValidator;
    }

    $onInit() {
      this.dynHost = angular.copy(this.$scope.currentActionData.dynHost);
      this.product = angular.copy(this.$scope.currentActionData.product);

      this.loading = false;

      this.$scope.updateDynHost = () => this.updateDynHost();
    }

    ipTargetCheck(input) {
      input.$setValidity(
        'iptarget',
        this.WucValidator.isValidIpv4(this.dynHost.ip) ||
          this.WucValidator.isValidIpv6(this.dynHost.ip),
      );
    }

    subDomainCheck(input) {
      input.$setValidity(
        'subdomain',
        this.dynHost.subDomain === null ||
          this.dynHost.subDomain === '' ||
          this.WucValidator.isValidSubDomain(this.dynHost.subDomain),
      );
    }

    updateDynHost() {
      this.loading = true;
      return this.Domain.updateDynHost(this.product.name, this.dynHost.id, {
        ip: this.dynHost.ip,
        subDomain: punycode.toASCII(this.dynHost.subDomain),
      })
        .then(() =>
          this.Domain.refreshZoneState(this.product.name).then(() =>
            this.Alerter.success(
              this.$translate.instant('domain_tab_DYNHOST_edit_success'),
              this.$scope.alerts.main,
            ),
          ),
        )
        .catch((err) =>
          this.Alerter.error(
            `${this.$translate.instant('domain_tab_DYNHOST_error')} ${
              err.message
            }`,
            this.$scope.alerts.main,
          ),
        )
        .finally(() => {
          this.loading = false;
          this.$scope.resetAction();
        });
    }
  },
);
