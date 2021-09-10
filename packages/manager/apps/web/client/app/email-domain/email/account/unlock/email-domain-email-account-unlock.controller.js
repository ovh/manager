export default class EmailsUnlockAccountCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, WucEmails) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.currentAccount = this.$scope.currentActionData || null;
    this.constants = {
      passwordMaxLength: 30,
      passwordMinLength: 9,
    };
    this.model = { password: '' };
    this.validation = { password: '' };
    this.$scope.changePasswordAccount = () => this.changePasswordAccount();
  }

  accountPasswordCheck(input) {
    input.$setValidity(
      'passwordCheck',
      !!this.model.password &&
        !/^\s/.test(this.model.password) &&
        !/\s$/.test(this.model.password) &&
        !this.model.password.match(
          /[ÂÃÄÀÁÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/,
        ),
    );
  }

  isPasswordMatches() {
    return (
      !!this.model.password &&
      !!this.validation.password &&
      this.model.password === this.validation.password
    );
  }

  changePasswordAccount() {
    this.WucEmails.changePasswordAccount(
      this.$stateParams.productId,
      this.currentAccount.accountName,
      this.model,
    )
      .then(() =>
        this.Alerter.success(
          this.$translate.instant(
            'email_tab_modal_change_account_password_success',
          ),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'email_tab_modal_change_account_password_error',
          ),
          err.data,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => this.$scope.resetAction());
  }
}
