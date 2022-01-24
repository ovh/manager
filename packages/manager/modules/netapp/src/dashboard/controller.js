import { SUPPORT_SUBSCRIPTION_OFFER_IMPRESSION_TRACKING_DATA } from './constants';

export default class OvhManagerNetAppDashboardCtrl {
  /* @ngInject */
  constructor($translate, atInternet, Alerter) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Alerter = Alerter;
  }

  onBillingInformationError(error) {
    this.Alerter.error(error);
  }

  onAdviceClick() {
    this.atInternet.trackImpression(
      SUPPORT_SUBSCRIPTION_OFFER_IMPRESSION_TRACKING_DATA,
    );
  }
}
