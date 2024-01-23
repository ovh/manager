import { ACTIONS, ACTION_LABELS } from '../constants';
import { L7_POLICY_EDITION_TRACKING_SUFFIX } from './constants';

export default class OctaviaLoadBalancerL7PoliciesListCtrl {
  constructor() {
    this.ACTIONS = ACTIONS;
    this.ACTION_LABELS = ACTION_LABELS;
    this.L7_POLICY_EDITION_TRACKING_SUFFIX = L7_POLICY_EDITION_TRACKING_SUFFIX;
  }

  getAttribute(policy) {
    switch (policy.action) {
      case this.ACTIONS.REDIRECT_TO_URL:
        return policy.redirectUrl;
      case this.ACTIONS.REDIRECT_PREFIX:
        return policy.redirectPrefix;
      case this.ACTIONS.REDIRECT_TO_POOL:
        return policy.redirectPoolId;
      default:
        return '-';
    }
  }
}
