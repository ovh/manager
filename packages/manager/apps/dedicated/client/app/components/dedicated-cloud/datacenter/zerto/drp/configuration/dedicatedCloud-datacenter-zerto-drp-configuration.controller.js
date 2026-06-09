import get from 'lodash/get';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
} from '../../dedicatedCloud-datacenter-zerto.constants';

export default class {
  /* @ngInject */
  constructor(dedicatedCloudZerto) {
    this.dedicatedCloudZerto = dedicatedCloudZerto;
    this.DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
  }

  $onInit() {
    this.isDeleteDisabled = this.computeIsDeleteDisabled();
  }

  computeIsDeleteDisabled() {
    if (this.formattedState === DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering) {
      return true;
    }
    if (this.zertoState.drpType === DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh) {
      if (
        this.zertoState.vpnStatus ===
        DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS.configuring
      ) {
        return true;
      }
      const remoteState = get(this.zertoState, 'remoteSiteInformation.state');
      if (remoteState) {
        const remoteFormattedState = this.dedicatedCloudZerto.constructor.formatStatus(
          remoteState,
        );
        return remoteFormattedState !== DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered;
      }
    }
    return false;
  }

  getPrimaryDcName() {
    return (
      get(this.primaryDatacenter, 'name') ||
      `DC ${this.datacenterId}`
    );
  }

  getSecondaryDcName() {
    const remoteDcId = get(this.zertoState, 'remoteSiteInformation.datacenterId');
    return (
      get(this.secondaryDatacenter, 'name') ||
      (remoteDcId ? `DC ${remoteDcId}` : '-')
    );
  }
}
