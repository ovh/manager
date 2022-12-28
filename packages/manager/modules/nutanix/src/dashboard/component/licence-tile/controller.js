import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import NutanixLicences from './licences.class';

export default class NutanixLicenceTileCtrl {
  /* @ngInject */
  constructor(atInternet, NutanixService) {
    this.atInternet = atInternet;
    this.NutanixService = NutanixService;
  }

  $onInit() {
    this.loadingTechnicalDetails = true;
    this.defaultLicenseLength = 12;
    this.expand = false;
    this.loadTechnicalDetails(this.serviceId)
      .then(({ license, features }) => {
        const licenceFeatures = isArray(license.features)
          ? license.features
          : [];
        this.licences = new NutanixLicences(licenceFeatures);
        this.features = features;
      })
      .finally(() => {
        this.loadingTechnicalDetails = false;
      });
  }

  loadTechnicalDetails(serviceId) {
    return this.NutanixService.getHardwareInfo(serviceId)
      .then((data) => data.nutanixCluster)
      .catch((error) => this.handleError(error));
  }

  handleError(error) {
    if (isFunction(this.onError)) {
      this.onError({ error });
    }
  }

  toggleLicenseDetails() {
    const licenseTogglePrefix = 'hpc::nutanix::cluster::dashboard';
    const licenseToggleSuffix = this.expand
      ? 'see-less-options'
      : 'see-more-options';
    this.atInternet.trackClick({
      name: `${licenseTogglePrefix}::${licenseToggleSuffix}`,
      type: 'action',
    });
    this.expand = !this.expand;
  }
}
