import {
  LISTENER_EDITION_TRACKING_SUFFIX,
  POOL_DETAIL_TRACKING_SUFFIX,
} from './constants';

export default class OctaviaLoadBalancerOverviewCtrl {
  constructor() {
    this.LISTENER_EDITION_TRACKING_SUFFIX = LISTENER_EDITION_TRACKING_SUFFIX;
    this.POOL_DETAIL_TRACKING_SUFFIX = POOL_DETAIL_TRACKING_SUFFIX;
  }
}
