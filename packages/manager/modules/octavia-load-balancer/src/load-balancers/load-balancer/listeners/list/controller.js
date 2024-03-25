import {
  LISTENER_EDITION_TRACKING_SUFFIX,
  LISTENER_PROTOCOLS_ENABLING_POLICIES,
  POOL_DETAIL_TRACKING_SUFFIX,
} from './constants';

export default class OctaviaLoadBalancerListenerListCtrl {
  constructor() {
    this.LISTENER_EDITION_TRACKING_SUFFIX = LISTENER_EDITION_TRACKING_SUFFIX;
    this.POOL_DETAIL_TRACKING_SUFFIX = POOL_DETAIL_TRACKING_SUFFIX;
  }

  static isPoliciesManagementAvailableForListener(listener) {
    return LISTENER_PROTOCOLS_ENABLING_POLICIES.includes(listener.protocol);
  }
}
