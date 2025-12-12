export default class ReasonWarningModal {
  /* @ngInject */
  constructor($translate, coreConfig, reasonService) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.reasonService = reasonService;
  }

  getReason() {
    const strategy = this.reasonService.getReasonStrategy(this.action);
    return strategy.constructor.getReasons(
      this.service,
      this.coreConfig.getUser(),
    );
  }

  closeModal() {
    this.service = null;
    this.action = null;
  }
}
