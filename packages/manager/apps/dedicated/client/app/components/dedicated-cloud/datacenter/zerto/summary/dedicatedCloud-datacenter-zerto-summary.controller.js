import get from 'lodash/get';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
} from '../dedicatedCloud-datacenter-zerto.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $timeout,
    $translate,
    Alerter,
    dedicatedCloudZerto,
    OvhApiMe,
    Validator,
  ) {
    this.$state = $state;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.dedicatedCloudZerto = dedicatedCloudZerto;
    this.OvhApiMe = OvhApiMe;
    this.Validator = Validator;
    this.VPN_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS;
  }

  $onInit() {
    this.zertoInformations = this.$state.params.zertoInformations;
    this.zertoInformations.drpType = this.zertoInformations.drpType ?? 'ovh';
    this.zertoStatus = this.dedicatedCloudZerto.constructor.formatStatus(
      this.zertoInformations.state,
    );

    this.email = this.currentUser.email;
    this.deleteActionAvailable =
      this.zertoInformations.drpType ===
      DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise
        ? true
        : this.dedicatedCloudZerto.constructor.formatStatus(
            get(this.currentZerto, 'remoteSiteInformation.state'),
          ) === DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered;

    this.ipValidator = (() => ({
      test: (ip) => this.Validator.isValidIpv4(ip),
    }))();

    this.isValidIpv4Block = (() => ({
      test: (ip) => this.Validator.isValidIpv4Block(ip),
    }))();

    this.canConfigureVpn = this.canSetVpnConfiguration();
    this.isVpnNotConfigured = this.hasNoVpnConfiguration();
  }

  isProvisionning() {
    return (
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering ===
      this.currentZerto.state
    );
  }

  isZertoTypeOnPremise() {
    return (
      this.zertoInformations.drpType ===
      DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise
    );
  }

  canSetVpnConfiguration() {
    const vpnConfigState = get(
      this.currentZerto,
      'remoteSiteInformation.vpnConfigState',
    );
    return (
      this.isZertoTypeOnPremise() &&
      this.currentZerto.state ===
        DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered &&
      vpnConfigState !== this.VPN_STATUS.configuring
    );
  }

  hasNoVpnConfiguration() {
    return (
      get(this.currentZerto, 'remoteSiteInformation.vpnConfigState') ===
      this.VPN_STATUS.notConfigured
    );
  }

  validateVpnConfiguration() {
    this.isValidatingVpnConfiguration = true;
    return this.dedicatedCloudZerto
      .configureVpn(this.zertoInformations)
      .then(() =>
        this.goBackToDashboard(
          this.$translate.instant('dedicatedCloud_datacenter_drp_vpn_success'),
        ),
      )
      .catch(() => {
        this.Alerter.error(
          this.$translate.instant(
            'dedicatedCloud_datacenter_drp_vpn_error',
            'dedicatedCloudDatacenterZertoAlert',
          ),
        );
      })
      .finally(() => {
        this.isValidatingVpnConfiguration = true;
      });
  }
}
