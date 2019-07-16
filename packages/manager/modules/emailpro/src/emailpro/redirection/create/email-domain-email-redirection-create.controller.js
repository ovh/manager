angular.module('App').controller(
  'EmailMXPlanCreateRedirectionCtrl',
  class EmailMXPlanCreateRedirectionCtrl {
    /**
     * Constructor
     * @param $scope
     * @param $stateParams
     * @param $translate
     * @param Alerter
     * @param WucEmails
     */
    constructor($scope, $stateParams, $translate, Alerter, WucEmails) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.WucEmails = WucEmails;
    }

    $onInit() {
      this.constants = {
        nameMaxLength: 32,
        nameMinLength: 2,
        nameRegexPattern: /^\w+[\w.-]+\w*$/,
      };
      this.copyChoices = ['local', 'none'];
      this.domain = this.$scope.exchange.associatedDomainName;
      this.loading = false;
      this.model = {
        redirectionFrom: '',
        redirectionKeepCopy: null,
        redirectionSubdomainFrom: '',
        redirectionTo: '',
      };

      this.$scope.createRedirection = () => this.createRedirection();
    }

    redirectionToCheck(input) {
      input.$setValidity(
        'redirectionTo',
        validator.isEmail(this.model.redirectionTo),
      );
    }

    createRedirection() {
      return this.WucEmails.createRedirection(this.$scope.exchange.associatedDomainName, {
        from: `${_.trim(this.model.redirectionFrom)}@${_.trim(this.model.redirectionSubdomainFrom)}${this.model.redirectionSubdomainFrom && '.'}${this.domain}`,
        localCopy: this.model.redirectionKeepCopy === 'local',
        to: this.model.redirectionTo,
      })
        .then(() => this.Alerter.success(
          this.$translate.instant('email_tab_modal_create_redirection_success'),
          this.$scope.alerts.main,
        ))
        .catch(err => this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_modal_create_redirection_error'),
          err,
          this.$scope.alerts.main,
        ))
        .finally(() => this.$scope.resetAction());
    }
  },
);
