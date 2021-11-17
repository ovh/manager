import { TRAVAUX_LINK } from './constants';

export default class NutanixGeneralInfoCtrl {
  /* @ngInject */
  constructor($translate, atInternet, ovhManagerRegionService, NutanixService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.TRAVAUX_LINK = TRAVAUX_LINK;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.NutanixService = NutanixService;
  }

  $onInit() {
    this.loadServcesDetails();
  }

  loadServcesDetails() {
    this.loadingServicesDetails = true;
    return this.NutanixService.getServicesDetails(this.serviceInfo.serviceId)
      .then((servicesDetails) => {
        this.servicesDetails = servicesDetails;
      })
      .finally(() => {
        this.loadingServicesDetails = false;
      });
  }

  trackClick(trackText) {
    return this.atInternet.trackClick({
      name: `${this.trackingPrefix}::${trackText}`,
      type: 'action',
    });
  }
}
