import { PRIVATE_NETWORK_HELP } from './constants';
import { TRACKING_NAME, TRACKING_CHAPTER_1 } from '../constants';

export default class OctaviaLoadBalancerOnboardingCtrl {
  /* @ngInject */
  constructor(coreConfig, atInternet, coreURLBuilder, $window) {
    const { ovhSubsidiary } = coreConfig.getUser();
    this.privateNetworkHelpUrl =
      PRIVATE_NETWORK_HELP[ovhSubsidiary] || PRIVATE_NETWORK_HELP.DEFAULT;
    this.atInternet = atInternet;
    this.$window = $window;
    this.coreURLBuilder = coreURLBuilder;
  }

  trackPrivateNetworkHelp() {
    this.atInternet.trackClick({
      name: `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::create-private-network::know-more`,
      type: 'navigation',
    });
  }
}
