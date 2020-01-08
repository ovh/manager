import isNull from 'lodash/isNull';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_IP_BLOCK_REG_EXP,
  DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP,
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
} from '../../../dedicatedCloud-datacenter-drp.constants';

export default class {
  /* @ngInject */
  constructor(ipFeatureAvailability, OvhApiDedicatedCloud) {
    this.ipFeatureAvailability = ipFeatureAvailability;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.IP_BLOCK_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_BLOCK_REG_EXP;
    this.DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.MAC_ADDRESS_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP;
    this.UNAVAILABLE_IP_STATUSES = DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS;
  }

  $onInit() {
    this.OvhApiDedicatedCloud.Ip()
      .v6()
      .resetQueryCache();
    this.OvhApiDedicatedCloud.Ip()
      .v6()
      .resetCache();

    if (this.defaultLocalVraNetwork) {
      this.drpInformations.localVraNetwork = this.defaultLocalVraNetwork;
    }

    this.drpInformations.primaryPcc = this.currentService;
    this.availableDatacenters = this.datacenters;
    this.availableIpAddress = this.getAvailableAddresses(this.ipAddressDetails);

    this.drpInformations.primaryDatacenter = this.availableDatacenters.find(
      ({ id }) => parseInt(this.datacenterId, 10) === id,
    );
    this.selectedIpAddress = this.availableIpAddress.find(({ ip }) =>
      [
        this.drpInformations.primaryEndpointIp,
        this.drpInformations.ovhEndpointIp,
      ].includes(ip),
    );

    this.ipOrderLink = this.getIpOrderLink(
      this.drpInformations.drpType,
      this.ipFeatureAvailability.allowIPFailoverOrder(),
      this.configurationStepName,
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
    if (this.drpInformations.drpType === this.DRP_OPTIONS.ovh) {
      this.drpInformations.primaryEndpointIp = endpointIp;
    } else {
      this.drpInformations.ovhEndpointIp = endpointIp;
    }
  }
}
