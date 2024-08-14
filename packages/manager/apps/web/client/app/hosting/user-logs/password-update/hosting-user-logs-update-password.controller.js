import get from 'lodash/get';

angular.module('App').controller(
  'HostingUserLogsUpdatePasswordCtrl',
  class HostingUserLogsUpdatePasswordCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, Alerter, Hosting) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Hosting = Hosting;
    }

    $onInit() {
      this.condition = this.Hosting.constructor.getPasswordConditions();
      this.user = this.$scope.currentActionData;
      this.password = {
        value: null,
        confirmation: null,
      };

      this.$scope.updatePassword = () => this.updatePassword();
    }

    isPasswordInvalid() {
      return !this.Hosting.constructor.isPasswordValid(
        get(this.password, 'value', ''),
      );
    }

    isPasswordConfirmationInvalid() {
      return this.password.value !== this.password.confirmation;
    }

    isPasswordValid() {
      return (
        this.password.value &&
        this.password.confirmation &&
        this.password.value === this.password.confirmation &&
        this.Hosting.constructor.isPasswordValid(this.password.value)
      );
    }

    shouldDisplayDifferentPasswordMessage() {
      return (
        this.password.value &&
        this.password.confirmation &&
        this.password.value !== this.password.confirmation
      );
    }

    updatePassword() {
      this.$scope.resetAction();
      return this.Hosting.userLogsChangePassword(
        this.$stateParams.productId,
        this.user.ownLogsId,
        this.user.login,
        this.password.value,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'hosting_tab_USER_LOGS_configuration_change_password_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_USER_LOGS_configuration_change_password_fail',
              { t0: this.user.login },
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        });
    }
  },
);
