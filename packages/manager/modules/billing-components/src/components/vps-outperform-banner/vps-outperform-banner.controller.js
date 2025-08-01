import { SERVICE_TYPE } from '../utils/constants';

export default class BillingVpsOutperformBannerController {
  /* @ngInject */
  constructor($window, BillingService, coreURLBuilder) {
    this.$window = $window;
    this.BillingService = BillingService;
    this.coreURLBuilder = coreURLBuilder;
    this.SERVICE_TYPE = SERVICE_TYPE;
  }

  $onInit() {
    this.BillingService.getVPSMigration2020Availability(this.serviceName).then(
      (hasOutperformAvailablity) => {
        this.hasOutperformAvailablity = hasOutperformAvailablity;
      },
    );
  }

  goToOutperformPage() {
    this.$window.top.location.href = this.coreURLBuilder.buildURL(
      'dedicated',
      `#/vps/outperform?vpsName=${this.serviceName}`,
    );
  }
}
