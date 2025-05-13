angular.module('App').controller(
  'DomainDynHostLoginAddCtrl',
  class DomainDynHostLoginAddCtrl {
    /* @ngInject */
    constructor($scope, $translate, Alerter, Domain, WucValidator) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
      this.WucValidator = WucValidator;
    }

    $onInit() {
      this.product = angular.copy(this.$scope.currentActionData.product);

      this.const = {
        nbMaxSuffix: 10,
        nbMinPassword: 8,
        nbMaxPassword: 31,
      };
      this.dynHostLogin = { loginSuffix: '', subDomain: '', password: '' };
      this.loading = false;
      this.validation = { password: '' };

      this.$scope.addLogin = () => this.addLogin();
    }

    isPasswordMatches(input = null) {
      const valid =
        !!this.dynHostLogin.password &&
        !!this.validation.password &&
        this.dynHostLogin.password === this.validation.password;
      if (input && typeof input.$setValidity === 'function') {
        input.$setValidity('match', valid);
      }
      return valid;
    }

    loginSuffixCheck(input) {
      input.$setValidity(
        'login',
        /^[\w.-]+$/.test(this.dynHostLogin.loginSuffix),
      );
    }

    subDomainCheck(input) {
      input.$setValidity(
        'subdomain',
        this.dynHostLogin.subDomain === '*' ||
          this.WucValidator.isValidSubDomain(this.dynHostLogin.subDomain),
      );
    }

    addLogin() {
      this.loading = true;
      this.dynHostLogin.subDomain = punycode.toASCII(
        this.dynHostLogin.subDomain,
      );

      return this.Domain.addDynHostLogin(this.product.name, this.dynHostLogin)
        .then(() =>
          this.Alerter.success(
            this.$translate.instant('domain_tab_DYNHOST_add_login_success'),
            this.$scope.alerts.main,
          ),
        )
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_DYNHOST_error'),
            err,
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
