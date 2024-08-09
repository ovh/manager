import { GUIDES_URL } from '../../../general-info/constants';

export default class NutanixLicenceTileLegacyFeaturesCtrl {
  /* @ngInject */
  constructor(atInternet, coreConfig) {
    this.atInternet = atInternet;
    const { ovhSubsidiary } = coreConfig.getUser();
    this.guideLink = `${GUIDES_URL[ovhSubsidiary] ||
      GUIDES_URL.DEFAULT}packaged`;
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
