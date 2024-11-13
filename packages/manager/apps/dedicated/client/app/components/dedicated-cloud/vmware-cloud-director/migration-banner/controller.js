export default class ManagedVcdMigrationBannerCtrl {
  /* @ngInject */
  constructor(DedicatedCloud, atInternet) {
    this.DedicatedCloud = DedicatedCloud;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.loadMigrationState();
  }

  trackPage(name) {
    this.atInternet.trackPage({
      name: `${this.trackingPrefix}${name}`,
    });
  }

  loadMigrationState() {
    this.migrationState = null;

    this.DedicatedCloud.getPCCMigrationState(this.serviceName).then((state) => {
      this.migrationState = state;
      if (state.isEnabling) {
        this.trackPage(
          'vmware::vmware::banner-info::migrate_to_managed_vcd_pending',
        );
      }
    });

    this.DedicatedCloud.getManagedVCDMigrationState(this.serviceName).then(
      (state) => {
        if (state.isDone) {
          this.trackPage(
            'vmware::vmware::banner-info::migrate_to_managed_vcd_success',
          );
        }
      },
    );
  }
}
