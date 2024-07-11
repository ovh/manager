export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.guideLink = this.DedicatedCloud.getVCDGuideLink();
    this.checkMigration();
  }

  checkMigration() {
    this.loading = true;
    return this.DedicatedCloud.getManagedVCDMigrationState(this.productId)
      .then((state) => {
        this.vcdMigrationState = state;
        this.migrationTitle = this.$translate.instant(
          this.vcdMigrationState.isDone
            ? 'dedicatedCloud_vmware_cloud_director_migration'
            : 'dedicatedCloud_vmware_cloud_director_validate_migration',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
