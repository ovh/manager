import get from 'lodash/get';

angular.module('App').controller(
  'HostingFtpUserUpdatePasswordCtrl',
  class HostingFtpUserUpdatePasswordCtrl {
    /* @ngInject */
    constructor(
      $scope,
      $stateParams,
      $translate,
      Alerter,
      Hosting,
      HostingUser,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Hosting = Hosting;
      this.HostingUser = HostingUser;
    }

    $onInit() {
      this.condition = this.Hosting.constructor.getPasswordConditions();
      this.login = this.$scope.currentActionData;
      this.password = {
        value: null,
        confirmation: null,
      };

      this.$scope.updatePassword = () => this.updatePassword();
    }

    isPasswordValid() {
      return (
        this.password.value &&
        this.password.confirmation &&
        this.password.value === this.password.confirmation &&
        this.Hosting.constructor.isPasswordValid(this.password.value)
      );
    }

    isPasswordInvalid() {
      return !this.Hosting.constructor.isPasswordValid(
        get(this.password, 'value'),
      );
    }

    isPasswordConfirmationInvalid() {
      return this.password.value !== this.password.confirmation;
    }

    updatePassword() {
      this.$scope.resetAction();
      return this.HostingUser.changePassword(
        this.$stateParams.productId,
        this.login,
        this.password.value,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'hosting_tab_FTP_configuration_change_password_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_FTP_configuration_change_password_fail',
              { t0: this.login },
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        });
    }
  },
);
