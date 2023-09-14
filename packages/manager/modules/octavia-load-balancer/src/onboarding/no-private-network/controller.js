import { PRIVATE_NETWORK_HELP } from './constants';
import { TRACKING_NAME, TRACKING_CHAPTER_1 } from '../constants';

export default class OctaviaLoadBalancerOnboardingCtrl {
  /* @ngInject */
  constructor(coreConfig, atInternet, coreURLBuilder, $window, $state) {
    const { ovhSubsidiary } = coreConfig.getUser();
    this.privateNetworkHelpUrl =
      PRIVATE_NETWORK_HELP[ovhSubsidiary] || PRIVATE_NETWORK_HELP.DEFAULT;
    this.atInternet = atInternet;
    this.ctaTrackName = `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::add`;
    this.$window = $window;
    this.coreURLBuilder = coreURLBuilder;
    this.$state = $state;
  }

  dismissPrivateNetworkModal() {
    this.$state.go('^');
  }

  goToPrivateNetworkCreation() {
    this.atInternet.trackClick({
      name: `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::create-private-network::add-private-network`,
      type: 'navigation',
    });
    this.$window.location.href = this.coreURLBuilder.buildURL(
      'public-cloud',
      `#/public-cloud/pci/projects/${this.projectId}/private-networks/new`,
    );
  }

  trackPrivateNetworkHelp() {
    this.atInternet.trackClick({
      name: `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::create-private-network::know-more`,
      type: 'navigation',
    });
  }
}
