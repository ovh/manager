export default class ReasonWarningModal {
  /* @ngInject */
  constructor($translate, coreConfig, reasonService, atInternet) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.reasonService = reasonService;
    this.atInternet = atInternet;
  }

  triggerTracking(reasons) {
    const trackingSuffix =
      this.reasonService.getTrackingActionLabel(this.action) +
      (reasons && reasons.length > 0
        ? `::${reasons.length === 1 ? reasons[0] : reasons.join('_')}`
        : '');
    this.atInternet.trackPage({
      name: `hub::billing::services::services::pop-up::action-declined::${trackingSuffix}`,
    });
  }

  getReason() {
    const strategy = this.reasonService.getReasonStrategy(this.action);
    const reasons = strategy.constructor.getReasons(
      this.service,
      this.coreConfig.getUser(),
    );
    this.triggerTracking(reasons);
    return reasons;
  }

  closeModal() {
    this.service = null;
    this.action = null;
  }
}
