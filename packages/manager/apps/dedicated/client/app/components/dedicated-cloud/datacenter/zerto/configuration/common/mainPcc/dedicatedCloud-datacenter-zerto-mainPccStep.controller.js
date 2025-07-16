import isNull from 'lodash/isNull';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_IP_BLOCK_REG_EXP,
  DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP,
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
} from '../../../dedicatedCloud-datacenter-zerto.constants';

export default class {
  /* @ngInject */
  constructor(ipFeatureAvailability, OvhApiDedicatedCloud, coreURLBuilder) {
    this.ipFeatureAvailability = ipFeatureAvailability;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.IP_BLOCK_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_BLOCK_REG_EXP;
    this.DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.MAC_ADDRESS_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP;
    this.UNAVAILABLE_IP_STATUSES = DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.OvhApiDedicatedCloud.Ip()
      .v6()
      .resetQueryCache();
    this.OvhApiDedicatedCloud.Ip()
      .v6()
      .resetCache();

    if (this.defaultLocalVraNetwork) {
      this.zertoInformations.localVraNetwork = this.defaultLocalVraNetwork;
    }

    this.zertoInformations.primaryPcc = this.currentService;
    this.availableDatacenters = this.datacenters;
    this.availableIpAddress = this.getAvailableAddresses(this.ipAddressDetails);

    this.zertoInformations.primaryDatacenter = this.availableDatacenters.find(
      ({ id }) => parseInt(this.datacenterId, 10) === id,
    );
    this.selectedIpAddress = this.availableIpAddress.find(({ ip }) =>
      [
        this.zertoInformations.primaryEndpointIp,
        this.zertoInformations.ovhEndpointIp,
      ].includes(ip),
    );

    this.ipOrderLink = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/ip/agoraOrder',
    );
  }

  getAvailableAddresses(ipAddressDetails) {
    return ipAddressDetails.filter(
      ({ usageDetails }) =>
        isNull(usageDetails) &&
        !this.UNAVAILABLE_IP_STATUSES.includes(usageDetails) &&
        !this.MAC_ADDRESS_REG_EXP.test(usageDetails),
    );
  }

  setEndpointIp(endpointIp) {
    if (this.zertoInformations.drpType === this.DRP_OPTIONS.ovh) {
      this.zertoInformations.primaryEndpointIp = endpointIp;
    } else {
      this.zertoInformations.ovhEndpointIp = endpointIp;
    }
  }
}
