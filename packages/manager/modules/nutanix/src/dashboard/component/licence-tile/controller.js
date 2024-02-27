import NutanixLicences from './licences.class';

export default class NutanixLicenceTileCtrl {
  /* @ngInject */
  constructor(atInternet, NutanixService) {
    this.atInternet = atInternet;
    this.NutanixService = NutanixService;
  }

  $onInit() {
    this.defaultLicenseLength = 12;
    this.expand = false;
    const { license, features } = this.hardwareInfo;
    const licenceFeatures = Array.isArray(license.features)
      ? license.features
      : [];
    this.licences = new NutanixLicences(licenceFeatures);
    this.features = features;
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
