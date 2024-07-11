export default class ManagedVcdMigrationBannerCtrl {
  /* @ngInject */
  constructor(DedicatedCloud) {
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.loadMigrationState();
  }

  loadMigrationState() {
    this.migrationState = null;
    this.DedicatedCloud.getPCCMigrationState(this.serviceName).then((state) => {
      this.migrationState = state;
    });
  }
}
