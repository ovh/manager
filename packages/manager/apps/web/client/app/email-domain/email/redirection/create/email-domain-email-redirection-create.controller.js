import trim from 'lodash/trim';

export default class EmailsCreateRedirectionCtrl {
  /* @ngInject */
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
    this.domain = this.$stateParams.productId;
    this.loading = false;
    this.model = {
      redirectionFrom: '',
      redirectionKeepCopy: null,
      redirectionSubdomainFrom: '',
      redirectionTo: '',
    };

    this.$scope.createRedirection = () => this.createRedirection();
  }

  isAccountNameValid(name) {
    return (
      !name ||
      (name.length >= this.constants.nameMinLength &&
        name.length <= this.constants.nameMaxLength &&
        this.constants.nameRegexPattern.test(name))
    );
  }

  redirectionToCheck(input) {
    input.$setValidity(
      'redirectionTo',
      validator.isEmail(this.model.redirectionTo || input.$viewValue),
    );
  }

  createRedirection() {
    return this.WucEmails.createRedirection(this.$stateParams.productId, {
      from: `${trim(this.model.redirectionFrom)}@${trim(
        this.model.redirectionSubdomainFrom,
      )}${this.model.redirectionSubdomainFrom && '.'}${this.domain}`,
      localCopy: this.model.redirectionKeepCopy === 'local',
      to: this.model.redirectionTo,
    })
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('email_tab_modal_create_redirection_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_modal_create_redirection_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => this.$scope.resetAction());
  }
}
