import { VMWARE_CLOUD_FOUNDATION_PRODUCT_NAME } from '../../../vmware-cloud-director/vmware-cloud-director.constants';

export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud, atInternet) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.atInternet = atInternet;
    this.VMWARE_CLOUD_FOUNDATION_PRODUCT_NAME = VMWARE_CLOUD_FOUNDATION_PRODUCT_NAME;
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
      this.pccMigrationState.isDone
        ? 'dedicatedCloud_vmware_cloud_director_migration'
        : 'dedicatedCloud_vmware_cloud_director_validate_migration',
    );
  }
}
