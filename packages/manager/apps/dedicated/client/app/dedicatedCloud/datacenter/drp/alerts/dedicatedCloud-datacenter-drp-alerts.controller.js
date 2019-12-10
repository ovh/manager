import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
} from '../dedicatedCloud-datacenter-drp.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    dedicatedCloudDrp,
  ) {
    this.$state = $state;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
    this.DRP_VPN_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS;
  }

  $onInit() {
    if (!this.currentDrp.isSuccessAlertDisable) {
      return this.dedicatedCloudDrp.setDisableSuccessAlertPreference(this.currentDrp.serviceName);
    }

    return Promise.resolve(null);
  }

  disableSuccessAlert() {
    return this.dedicatedCloudDrp.setDisableSuccessAlertPreference(this.currentDrp.serviceName);
  }

  isOnSummaryState() {
    if (this.currentState !== undefined) {
      return this.currentState === 'app.dedicatedClouds.datacenter.drp.summary';
    }

    return false;
  }

  goToVpnConfigurationState() {
    return this.$state
      .go(
        'app.dedicatedClouds.datacenter.drp.summary',
        { datacenterId: this.currentDrp.datacenterId, drpInformations: this.currentDrp },
      );
  }
}
