export default class OvhManagerNetAppDashboardCtrl {
  /* @ngInject */
  constructor($translate, Alerter) {
    this.$translate = $translate;
    this.Alerter = Alerter;
  }

  onBillingInformationError(error) {
    this.Alerter.error(error);
  }
}
