export default class TelecomPackMigrationMigrationCtrl {
  /* @ngInject */
  constructor($scope, TucPackMigrationProcess) {
    this.$scope = $scope;
    this.TucPackMigrationProcess = TucPackMigrationProcess;
  }

  $onInit() {
    this.loading = {
      migrate: false,
    };
    this.process = null;
    this.migrationStatus = null;

    this.loading.migrate = true;
    this.process = this.TucPackMigrationProcess.getMigrationProcess();

    this.$scope.$on('$destroy', () => {
      this.TucPackMigrationProcess.stopTaskPolling();
    });

    return this.TucPackMigrationProcess.startTaskPolling()
      .then(() => {
        this.migrationStatus = 'success';
        this.loading.migrate = false;
      })
      .catch(() => {
        this.migrationStatus = 'error';
        this.loading.migrate = false;
      });
  }
}
