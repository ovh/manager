import get from 'lodash/get';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
} from '../dedicatedCloud-datacenter-drp.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $timeout,
    $translate,
    Alerter,
    dedicatedCloudDrp,
    OvhApiMe,
    Validator,
  ) {
    this.$state = $state;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.OvhApiMe = OvhApiMe;
    this.Validator = Validator;
    this.VPN_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS;
  }

  $onInit() {
    this.drpInformations = this.$state.params.drpInformations;
    this.drpStatus = this.dedicatedCloudDrp.constructor.formatStatus(
      this.drpInformations.state,
    );

    this.email = this.currentUser.email;
    this.deleteActionAvailable =
      this.drpInformations.drpType ===
      DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise
        ? true
        : this.dedicatedCloudDrp.constructor.formatStatus(
            get(this.currentDrp, 'remoteSiteInformation.state'),
          ) === DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered;

    this.ipValidator = (() => ({
      test: (ip) => this.Validator.isValidIpv4(ip),
    }))();

    this.canConfigureVpn = this.canSetVpnConfiguration();
    this.isVpnNotConfigured = this.hasNoVpnConfiguration();
  }

  isProvisionning() {
    return (
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering === this.currentDrp.state
    );
  }

  isDrpTypeOnPremise() {
    return (
      this.drpInformations.drpType ===
      DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise
    );
  }

  canSetVpnConfiguration() {
    const vpnConfigState = get(
      this.currentDrp,
      'remoteSiteInformation.vpnConfigState',
    );
    return (
      this.isDrpTypeOnPremise() &&
      this.currentDrp.state ===
        DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered &&
      vpnConfigState !== this.VPN_STATUS.configuring
    );
  }

  hasNoVpnConfiguration() {
    return (
      get(this.currentDrp, 'remoteSiteInformation.vpnConfigState') ===
      this.VPN_STATUS.notConfigured
    );
  }

  validateVpnConfiguration() {
    this.isValidatingVpnConfiguration = true;
    return this.dedicatedCloudDrp
      .configureVpn(this.drpInformations)
      .then(() =>
        this.goBackToDashboard(
          this.$translate.instant('dedicatedCloud_datacenter_drp_vpn_success'),
        ),
      )
      .catch(() => {
        this.Alerter.error(
          this.$translate.instant(
            'dedicatedCloud_datacenter_drp_vpn_error',
            'dedicatedCloudDatacenterDrpAlert',
          ),
        );
      })
      .finally(() => {
        this.isValidatingVpnConfiguration = true;
      });
  }
}
