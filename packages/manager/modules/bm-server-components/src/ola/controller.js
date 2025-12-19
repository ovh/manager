import {
  NEW_LACP_MODE_BANNER_FEATURE_ID,
  SCALE_HGR_MAC_COUNTER,
} from './ola.constants';

export default class OlaCtrl {
  /* @ngInject */
  constructor($state, olaService, ovhFeatureFlipping) {
    this.$state = $state;
    this.olaService = olaService;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    this.isLacpBannerAvailable = false;
    this.resilienceGuideUrl = this.olaService.getResilienceGuideUrl();
    this.olaService.getNetworkInterfaces(this.server?.name).then((data) => {
      if (data.length >= SCALE_HGR_MAC_COUNTER) {
        this.ovhFeatureFlipping
          .checkFeatureAvailability(NEW_LACP_MODE_BANNER_FEATURE_ID)
          .then((featureAvailability) => {
            this.isLacpBannerAvailable = featureAvailability.isFeatureAvailable(
              NEW_LACP_MODE_BANNER_FEATURE_ID,
            );
          });
      }
    });
  }
}
