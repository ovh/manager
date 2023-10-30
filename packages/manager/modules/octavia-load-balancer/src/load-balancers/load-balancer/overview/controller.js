import {
  PROVISIONING_STATUS_BADGES,
  OPERATING_STATUS_BADGES,
} from './constants';

export default class OctaviaLoadBalancerOverviewCtrl {
  constructor() {
    this.PROVISIONING_STATUS_BADGES = PROVISIONING_STATUS_BADGES;
    this.OPERATING_STATUS_BADGES = OPERATING_STATUS_BADGES;
  }
}
