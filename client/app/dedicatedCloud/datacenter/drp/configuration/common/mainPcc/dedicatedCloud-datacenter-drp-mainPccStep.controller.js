import {
  DEDICATEDCLOUD_DATACENTER_DRP_IP_BLOCK_REG_EXP,
  DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP,
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
} from '../../../dedicatedCloud-datacenter-drp.constants';

export default class {
  /* @ngInject */
  constructor(
    $q, $translate,
    ipFeatureAvailability, OvhApiDedicatedCloud,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.ipFeatureAvailability = ipFeatureAvailability;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.IP_BLOCK_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_BLOCK_REG_EXP;
    this.DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.MAC_ADDRESS_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP;
    this.UNAVAILABLE_IP_STATUSES = DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS;
  }

  $onInit() {
    this.OvhApiDedicatedCloud.Ip().v6().resetQueryCache();
    this.OvhApiDedicatedCloud.Ip().v6().resetCache();

    this.drpInformations.localVraNetwork = this.defaultLocalVraNetwork;
    this.drpInformations.primaryPcc = this.currentService;
    this.availableDatacenters = this.datacenters;
    this.availableIpAddress = this.getAvailableAddresses(this.ipAddressDetails);

    this.drpInformations.primaryDatacenter = this.availableDatacenters
      .find(({ id }) => parseInt(this.datacenterId, 10) === id);
    this.selectedIpAddress = this.availableIpAddress
      .find(({ ip }) => ip === this.drpInformations.primaryEndpointIp);
  }

  getAvailableAddresses(ipAddressDetails) {
    return ipAddressDetails
      .filter(({ usageDetails }) => _.isNull(usageDetails)
        && !this.UNAVAILABLE_IP_STATUSES.includes(usageDetails)
        && !this.MAC_ADDRESS_REG_EXP.test(usageDetails));
  }
}
