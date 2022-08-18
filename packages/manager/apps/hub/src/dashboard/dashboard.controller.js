import {
  BANNER_IP_REPRICING_AVAILABILITY,
  TRACKING_IMPRESSION_DATA,
} from './dashboard-contants';

export default class DashboardController {
  /* @ngInject */
  constructor($q, atInternet, hubDashboardService, ovhFeatureFlipping) {
    this.$q = $q;
    this.atInternet = atInternet;
    this.hubDashboardService = hubDashboardService;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    this.isVisibleIpsRepricing = false;

    return this.$q
      .all({
        bannerIpRepricingAvailability: this.ovhFeatureFlipping
          .checkFeatureAvailability(BANNER_IP_REPRICING_AVAILABILITY)
          .then(({ features }) => features[BANNER_IP_REPRICING_AVAILABILITY]),
        listIpsFailover: this.getIpsFailover(),
        trackingPrefix: this.trackingPrefix,
      })
      .then(
        ({
          bannerIpRepricingAvailability,
          listIpsFailover,
          trackingPrefix,
        }) => {
          this.prefix = trackingPrefix;
          if (bannerIpRepricingAvailability && listIpsFailover.length > 0) {
            this.isVisibleIpsRepricing = true;
            this.atInternet.trackImpression(TRACKING_IMPRESSION_DATA);
          }
        },
      );
  }

  getIpsFailover() {
    return this.hubDashboardService
      .getIpsFailover()
      .then((listIpsFailover) => listIpsFailover);
  }

  trackClickImpression() {
    this.atInternet.trackClickImpression({
      click: TRACKING_IMPRESSION_DATA,
    });
  }
}
