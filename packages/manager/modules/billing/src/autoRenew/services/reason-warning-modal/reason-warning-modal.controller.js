export default class ReasonWarningModal {
  /* @ngInject */
  constructor($translate, coreConfig, reasonService, atInternet) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.reasonService = reasonService;
    this.atInternet = atInternet;
  }

  $onChanges({ service, action }) {
    if (service && action) {
      const reasons = this.getReason();
      const trackingSuffix =
        this.action +
        (reasons && reasons.length > 0
          ? `::${reasons.length === 1 ? reasons[0] : reasons.join('_')}`
          : '');
      this.atInternet.trackPage({
        name: `hub::billing::services::services::pop-up::action-declined::${trackingSuffix}`,
      });
    }
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
