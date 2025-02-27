angular.module('App').controller(
  'HostingModuleDeleteCtrl',
  class HostingModuleDeleteCtrl {
    /* @ngInject */
    constructor(
      $scope,
      $stateParams,
      $translate,
      Alerter,
      HostingModule,
      coreURLBuilder,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.HostingModule = HostingModule;
      this.dataBaseHref = coreURLBuilder.buildURL(
        'web',
        `#/hosting/${$stateParams.productId}/database`,
      );
    }

    $onInit() {
      this.moduleToDelete = this.$scope.currentActionData;
      this.$scope.deleteModule = () => this.deleteModule();
    }

    deleteModule() {
      this.$scope.resetAction();
      return this.HostingModule.deleteModule(
        this.$stateParams.productId,
        this.moduleToDelete.id,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'hosting_configuration_tab_modules_delete_success',
            ),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_configuration_tab_modules_delete_fail',
              {
                t0: this.moduleToDelete.template.name,
              },
            ),
            err,
            this.$scope.alerts.main,
          );
        });
    }
  },
);
