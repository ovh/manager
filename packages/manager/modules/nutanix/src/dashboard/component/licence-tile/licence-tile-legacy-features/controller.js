export default class NutanixLicenceTileLegacyFeaturesCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  $onInit() {
    this.defaultLicenseLength = 12;
    this.expand = false;
  }

  toggleLicenseDetails() {
    const licenseTogglePrefix = 'hpc::nutanix::cluster::dashboard';
    const licenseToggleSuffix = `see-${this.expand ? 'less' : 'more'}-options`;
    this.atInternet.trackClick({
      name: `${licenseTogglePrefix}::${licenseToggleSuffix}`,
      type: 'action',
    });
    this.expand = !this.expand;
  }
}
