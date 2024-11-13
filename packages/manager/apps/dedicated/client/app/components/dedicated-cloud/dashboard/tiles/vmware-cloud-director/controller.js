export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud, atInternet) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.guideLinks = this.DedicatedCloud.getVCDGuideLinks();
    this.defineMigrationTitle();
  }

  trackGuideClick(guideName) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}vmware::tile::external-link::go-to-${guideName}`,
      type: 'action',
    });
  }

  defineMigrationTitle() {
    this.migrationTitle = this.$translate.instant(
      this.vcdMigrationState.isDone
        ? 'dedicatedCloud_vmware_cloud_director_migration'
        : 'dedicatedCloud_vmware_cloud_director_validate_migration',
    );
  }
}
