export default class ManagedVcdMigrationBannerCtrl {
  /* @ngInject */
  constructor(DedicatedCloud, atInternet) {
    this.DedicatedCloud = DedicatedCloud;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.trackMigrationState();
  }

  trackPage(name) {
    this.atInternet.trackPage({
      name: `${this.trackingPrefix}${name}`,
    });
  }

  trackMigrationState() {
    if (this.vcdMigrationState?.isEnabling) {
      this.trackPage(
        'vmware::vmware::banner-info::migrate_to_managed_vcd_pending',
      );
    }

    if (this.vcdMigrationState?.isEnabled) {
      this.trackPage(
        'vmware::vmware::banner-info::migrate_to_managed_vcd_success',
      );
    }
  }
}
