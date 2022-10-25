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
    this.atInternet.trackClick({
      name: 'hpc::nutanix::cluster::dashboard::see-more-options',
      type: 'action',
    });
    this.expand = !this.expand;
  }
}
