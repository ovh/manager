import get from 'lodash/get';

angular.module('App').controller(
  'HostingUserLogsCreateCtrl',
  class HostingUserLogsCreateCtrl {
    /* @ngInject */
    constructor(
      $scope,
      $stateParams,
      $translate,
      atInternet,
      Alerter,
      Hosting,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.atInternet = atInternet;
      this.Hosting = Hosting;
    }

    $onInit() {
      this.condition = this.Hosting.constructor.getPasswordConditions();
      this.model = {
        maxUserLength: 200,
        minUserLength: 1,
        selected: {
          login: null,
          description: '',
          password: {
            value: null,
            confirmation: null,
          },
        },
      };

      this.$scope.createUser = () => this.createUser();
      this.atInternet.trackPage({
        name: 'web::hosting::logs::create-user',
      });
    }

    isPasswordInvalid() {
      return !this.Hosting.constructor.isPasswordValid(
        get(this.model, 'selected.password.value', ''),
      );
    }

    isPasswordConfirmationInvalid() {
      return (
        this.model.selected.password.value !==
        this.model.selected.password.confirmation
      );
    }

    isPasswordValid() {
      return (
        this.model.selected.password.value &&
        this.model.selected.password.confirmation &&
        this.model.selected.password.value ===
          this.model.selected.password.confirmation &&
        this.Hosting.constructor.isPasswordValid(
          this.model.selected.password.value,
        )
      );
    }

    isUserValid() {
      return (
        this.model.selected.login &&
        this.model.selected.login.length >= this.model.minUserLength &&
        this.model.selected.login.length <= this.model.maxUserLength &&
        this.model.selected.login.match(/^[a-z-]+$/)
      );
    }

    shouldDisplayDifferentPasswordMessage() {
      return (
        this.model.selected.password.value &&
        this.model.selected.password.confirmation &&
        this.model.selected.password.value !==
          this.model.selected.password.confirmation
      );
    }

    createUser() {
      this.atInternet.trackClick({
        name: 'web::hosting::logs::create-user::confirm',
        type: 'action',
      });
      this.$scope.resetAction();

      this.Hosting.getOwnLogs(
        this.$stateParams.productId,
        this.$stateParams.productId,
      )
        .then((data) => {
          if (!Array.isArray(data) || data.length !== 1) {
            throw new Error('unable to get default own log');
          }

          this.Hosting.userLogsCreate(
            this.$stateParams.productId,
            data[0],
            this.model.selected.description,
            this.model.selected.login,
            this.model.selected.password.value,
          ).then(() => {
            this.Alerter.success(
              this.$translate.instant(
                'hosting_tab_USER_LOGS_configuration_user_create_success',
              ),
              this.$scope.alerts.main,
            );
          });
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_USER_LOGS_configuration_user_create_fail',
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        });
    }
  },
);
