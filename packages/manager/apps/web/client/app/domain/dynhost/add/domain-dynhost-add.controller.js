angular.module('App').controller(
  'DomainDynHostAddCtrl',
  class DomainDynHostAddCtrl {
    constructor($scope, $translate, Alerter, Domain, WucValidator) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
      this.WucValidator = WucValidator;
    }

    $onInit() {
      this.product = angular.copy(this.$scope.currentActionData);

      this.dynHost = { ipTarget: '', subDomain: '' };
      this.loading = false;

      this.$scope.addDynHost = () => this.addDynHost();
    }

    ipTargetCheck(input) {
      input.$setValidity(
        'iptarget',
        this.WucValidator.isValidIpv4(this.dynHost.ipTarget) ||
          this.WucValidator.isValidIpv6(this.dynHost.ipTarget),
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

    addDynHost() {
      this.loading = true;
      return this.Domain.addDynHost(this.product.name, {
        ip: this.dynHost.ipTarget,
        subDomain: punycode.toASCII(this.dynHost.subDomain),
      })
        .then(() =>
          this.Domain.refreshZoneState(this.product.name).then(() =>
            this.Alerter.success(
              this.$translate.instant('domain_tab_DYNHOST_add_success'),
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
