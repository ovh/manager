import endsWith from 'lodash/endsWith';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
} from '../dedicatedCloud-datacenter-drp.constants';

export default class {
  /* @ngInject */
  constructor(dedicatedCloudDrp) {
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
    this.DRP_VPN_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS;
  }

  $onInit() {
    if (!this.currentDrp.isSuccessAlertDisable) {
      return this.disableSuccessAlert();
    }

    return Promise.resolve(null);
  }

  disableSuccessAlert() {
    return this.dedicatedCloudDrp.setDisableSuccessAlertPreference(
      this.currentDrp.serviceName,
      true,
    );
  }

  isOnSummaryState() {
    if (this.currentState !== undefined) {
      return endsWith(this.currentState, 'summary');
    }

    return false;
  }
}
