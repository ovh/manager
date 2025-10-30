import get from 'lodash/get';
import isNull from 'lodash/isNull';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP,
  DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
} from '../../../dedicatedCloud-datacenter-zerto.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    DedicatedCloud,
    dedicatedCloudZerto,
    ipFeatureAvailability,
    OvhApiDedicatedCloud,
    coreURLBuilder,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.dedicatedCloudZerto = dedicatedCloudZerto;
    this.ipFeatureAvailability = ipFeatureAvailability;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.MAC_ADDRESS_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP;
    this.UNAVAILABLE_IP_STATUSES = DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS;
    this.coreURLBuilder = coreURLBuilder;
  }

  updateOptions(secondaryPcc) {
    this.isFetchingOptions = true;

    this.zertoInformations.secondaryPcc = secondaryPcc;
    this.zertoInformations.secondaryDatacenter = null;
    this.selectedSecondaryIpAddress = null;

    this.ipOrderLink = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/ip/agoraOrder',
    );

    this.OvhApiDedicatedCloud.Ip()
      .v6()
      .resetQueryCache();
    this.OvhApiDedicatedCloud.Ip()
      .v6()
      .resetCache();

    return this.$q
      .all({
        datacenters: this.DedicatedCloud.getDatacenters(
          secondaryPcc.serviceName,
        ),
        ipAddressDetails: this.dedicatedCloudZerto.getPccIpAddressesDetails(
          secondaryPcc.serviceName,
        ),
      })
      .then(({ datacenters, ipAddressDetails }) => {
        this.availableDatacenters = datacenters;
        this.availableIpAddress = ipAddressDetails.filter(
          ({ usageDetails }) =>
            isNull(usageDetails) &&
            !this.UNAVAILABLE_IP_STATUSES.includes(usageDetails) &&
            !this.MAC_ADDRESS_REG_EXP.test(usageDetails),
        );
      })
      .catch((error) => {
        this.displayErrorMessage(
          `${this.$translate.instant(
            'dedicatedCloud_datacenter_drp_get_state_error',
          )} ${get(error, 'data.message', error)}`,
        );
      })
      .finally(() => {
        this.isFetchingOptions = false;
      });
  }

  checkIfDatacenterHasHosts(datacenterId) {
    this.isCheckingHosts = true;
    this.isSecondaryDatacenterWithoutHosts = false;
    this.hostsOrderLink = this.getHostsOrderLink(
      datacenterId,
      this.zertoInformations.secondaryPcc.serviceName,
    );

    return this.DedicatedCloud.getHosts(
      this.zertoInformations.secondaryPcc.serviceName,
      datacenterId,
    )
      .then(({ length: hostsCount }) => {
        this.isSecondaryDatacenterWithoutHosts = hostsCount === 0;
      })
      .catch((error) => {
        this.displayErrorMessage(
          `${this.$translate.instant(
            'dedicatedCloud_datacenter_secondary_datacenter_get_hosts_error',
          )} ${get(error, 'data.message', '')}`,
        );
      })
      .finally(() => {
        this.isCheckingHosts = false;
      });
  }

  isStepValid() {
    return (
      this.selectedSecondaryPcc &&
      this.zertoInformations.secondaryDatacenter &&
      this.selectedSecondaryIpAddress
    );
  }

  validateConfiguration() {
    this.isValidating = true;

    return this.setupConfiguration(this.zertoInformations).finally(() => {
      this.isValidating = false;
    });
  }
}
