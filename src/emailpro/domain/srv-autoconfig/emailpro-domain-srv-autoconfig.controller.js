angular
  .module('Module.emailpro.controllers')
  .controller('EmailProDomainSrvAutoconfigCtrl', class EmailProDomainSrvAutoconfigCtrl {
    constructor($scope, $stateParams, $translate, EmailPro, EmailProDomains) {
      this.services = {
        $scope, $stateParams, $translate, EmailPro, EmailProDomains,
      };

      this.loading = {
        step1: false,
      };

      this.domain = $scope.currentActionData;
      this.services.$scope.configSRV = () => this.configSRV();
      this.services.$scope.getIsOVHDomain = () => this.isOVHDomain;

      this.init();
    }

    init() {
      this.loading.step1 = true;

      this.services
        .EmailProDomains
        .getDnsSettings(this.services.$stateParams.productId, this.domain.name)
        .then(
          (data) => { this.domainDiag = data; },
          (failure) => {
            this.services.$scope.resetAction();
            this.services.$scope.setMessage(this.services.$translate.instant('emailpro_tab_domain_diagnostic_add_field_failure'), failure);
          },
        )
        .finally(() => {
          this.loading.step1 = false;
        });
    }

    prepareModel() {
      return {
        domain: this.domain.name,
        fieldList: [this.domainDiag.srv],
      };
    }

    configSRV() {
      this.services.$scope.resetAction();

      this.services
        .EmailProDomains
        .addZoneDnsField(this.services.$stateParams.productId, this.prepareModel())
        .then((success) => {
          if (success.state === 'OK') {
            this.services.$scope.setMessage(this.services.$translate.instant('emailpro_tab_domain_diagnostic_add_field_success'), { status: 'success' });
          } else {
            this.services.$scope.setMessage(this.services.$translate.instant('emailpro_tab_domain_diagnostic_add_field_failure'), { status: 'error' });
          }
        }, failure => this.services.$scope.setMessage(this.services.$translate.instant('emailpro_tab_domain_diagnostic_add_field_failure'), failure));
    }
  });
