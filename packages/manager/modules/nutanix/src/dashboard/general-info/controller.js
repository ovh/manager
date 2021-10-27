import { TRAVAUX_LINK } from './constants';

export default class NutanixGeneralInfoCtrl {
  /* @ngInject */
  constructor($translate, ovhManagerRegionService, NutanixService) {
    this.$translate = $translate;
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
}
