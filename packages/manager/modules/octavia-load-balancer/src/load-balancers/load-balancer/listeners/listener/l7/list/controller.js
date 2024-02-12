import { ACTIONS, ACTION_LABELS, POLICIES_TRACKING } from '../constants';

export default class OctaviaLoadBalancerL7PoliciesListCtrl {
  constructor() {
    this.ACTIONS = ACTIONS;
    this.ACTION_LABELS = ACTION_LABELS;
    this.policyEditionTackingHit = POLICIES_TRACKING.EDIT;
    this.poolDashboardTackingHit = POLICIES_TRACKING.POOL_DASHBOARD;
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
