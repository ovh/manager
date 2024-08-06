import isObject from 'lodash/isObject';

angular.module('App').controller(
  'HostingEnvvarsCreateCtrl',
  class HostingEnvvarsCreateCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, Alerter, HostingEnvvars) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;

      this.Alerter = Alerter;
      this.HostingEnvvars = HostingEnvvars;
    }

    $onInit() {
      this.entryToCreate = {
        key: null,
        type: 'string',
        value: null,
      };

      this.$scope.create = () => this.create();
      this.$scope.isValid = () => this.isValid();
    }

    isValid() {
      return (
        isObject(this.addEnvvarForm) &&
        this.addEnvvarForm.$dirty &&
        this.addEnvvarForm.$valid
      );
    }

    create() {
      this.HostingEnvvars.create(
        this.$stateParams.productId,
        this.entryToCreate,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant('hosting_tab_ENVVARS_save_success'),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.error(
            this.$translate.instant('hosting_tab_ENVVARS_save_error') +
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
