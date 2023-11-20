import { DISCOVER_LINK, TRACKING_CHAPTER_1, TRACKING_NAME } from '../constants';
import { TRACKING_SUFFIX } from './constants';

export default class OctaviaLoadBalancerPoolsCtrl {
  /* @ngInject */
  constructor($state, $window, atInternet) {
    this.link = DISCOVER_LINK;
    this.$state = $state;
    this.$window = $window;
    this.atInternet = atInternet;
  }

  goToDiscoverOptions() {
    this.atInternet.trackClick({
      name: `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::${TRACKING_SUFFIX}::goto-discover-options`,
      type: 'action',
    });
    this.$window.open(this.link, '_blank');
  }
}
