export default class ManagedVcdMigrationBannerCtrl {
  /* @ngInject */
  constructor(DedicatedCloud, atInternet, ovhFeatureFlipping) {
    this.DedicatedCloud = DedicatedCloud;
    this.atInternet = atInternet;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    this.loadReminderFeatureAvailability();
    this.trackMigrationState();
  }

  loadReminderFeatureAvailability() {
    const feature = 'dedicated-cloud:vcd-migration:reminder';
    this.ovhFeatureFlipping
      .checkFeatureAvailability(feature)
      .then((featureAvailability) => {
        this.hasReminderAvailability = featureAvailability.isFeatureAvailable(
          feature,
        );
      });
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
