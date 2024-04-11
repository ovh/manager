export default class {
  /* @ngInject */
  constructor(SoftphoneService, $stateParams) {
    this.$stateParams = $stateParams;
    this.softphoneService = SoftphoneService;
  }

  handleToggleSwitch() {
    this.currentServiceIsBeta = !this.currentServiceIsBeta;
    this.softphoneService.handleToggleBeta(
      this.$stateParams.billingAccount,
      this.$stateParams.serviceName,
      this.currentServiceIsBeta,
    );
  }
}
