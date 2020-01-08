import isObject from 'lodash/isObject';

angular.module('App').controller(
  'controllers.Hosting.Envvars.edit',
  class HostingEnvvarsEditCtrl {
    constructor($scope, $stateParams, $translate, Alerter, HostingEnvvars) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;

      this.Alerter = Alerter;
      this.HostingEnvvars = HostingEnvvars;
    }

    $onInit() {
      this.entryToEdit = angular.copy(this.$scope.currentActionData).envvar;

      this.$scope.edit = () => this.edit();
      this.$scope.isValid = () => this.isValid();
    }

    isValid() {
      return (
        isObject(this.editEnvvarForm) &&
        this.editEnvvarForm.$dirty &&
        this.editEnvvarForm.$valid
      );
    }

    edit() {
      return this.HostingEnvvars.edit(
        this.$stateParams.productId,
        this.entryToEdit.key,
        this.entryToEdit,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant('hosting_tab_ENVVARS_edit_success'),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.error(
            this.$translate.instant('hosting_tab_ENVVARS_edit_error') +
              err.message,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.$scope.resetAction();
        });
    }
  },
);
