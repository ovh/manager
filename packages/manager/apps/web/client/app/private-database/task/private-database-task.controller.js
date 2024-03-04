import { PRIVATE_DATABASE_TASK_TABLE_ID } from './private-database.constants';

angular.module('App').controller(
  'PrivateDatabaseTasksCtrl',
  class PrivateDatabaseTasksCtrl {
    constructor(
      $scope,
      $stateParams,
      $translate,
      Alerter,
      ouiDatagridService,
      PrivateDatabase,
    ) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.productId = $stateParams.productId;
      this.privateDatabaseService = PrivateDatabase;
      this.alerter = Alerter;
      this.ouiDatagridService = ouiDatagridService;
      this.datagridId = PRIVATE_DATABASE_TASK_TABLE_ID;
    }

    $onInit() {
      this.getTasks();
    }

    getTasks() {
      this.taskDetails = null;
      this.isLoading = true;
      return this.privateDatabaseService
        .getTasks(this.productId)
        .then((ids) => {
          this.taskDetails = ids.sort((a, b) => b - a).map((id) => ({ id }));
        })
        .catch(() => {
          this.alerter.error(
            this.$translate.instant('privateDatabase_configuration_error'),
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    }

    transformItem(item) {
      return this.privateDatabaseService
        .getTaskDetails(this.productId, item.id)
        .catch(() => {
          this.alerter.error(
            this.$translate.instant('privateDatabase_configuration_error'),
            this.$scope.alerts.main,
          );
        });
    }

    refreshTable() {
      return this.ouiDatagridService.refresh(this.datagridId, true);
    }
  },
);
