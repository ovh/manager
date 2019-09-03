import get from 'lodash/get';
import isNull from 'lodash/isNull';

export default class {
  /* @ngInject */
  constructor(
    $q, $state, $stateParams, $translate, $uibModal,
    Alerter, DedicatedCloudDrp, ipFeatureAvailability, OvhApiDedicatedCloud,
    DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP,
    DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.DedicatedCloudDrp = DedicatedCloudDrp;
    this.ipFeatureAvailability = ipFeatureAvailability;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.MAC_ADDRESS_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP;
    this.UNAVAILABLE_IP_STATUSES = DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS;
  }

  $onInit() {
    this.isLoading = true;
    this.drpInformations = this.$stateParams.drpInformations;

    this.OvhApiDedicatedCloud.Ip().v6().resetQueryCache();
    this.OvhApiDedicatedCloud.Ip().v6().resetCache();

    return this.$q.all({
      ipAddressDetails:
        this.DedicatedCloudDrp.getPccIpAddressesDetails(this.$stateParams.productId),
      pcc: this.OvhApiDedicatedCloud.v6().get({
        serviceName: this.$stateParams.productId,
      }),
    })
      .then(({ ipAddressDetails, pcc }) => {
        this.drpInformations.primaryPcc = pcc;
        this.availableDatacenters = this.datacenters;
        this.availableIpAddress = this.getAvailableAddresses(ipAddressDetails);

        this.drpInformations.primaryDatacenter = this.availableDatacenters
          .find(({ id }) => parseInt(this.$stateParams.datacenterId, 10) === id);
        this.selectedIpAddress = this.availableIpAddress
          .find(({ ip }) => ip === this.$stateParams.drpInformations.primaryEndpointIp);
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_get_state_error')} ${get(error, 'data.message', error)}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getAvailableAddresses(ipAddressDetails) {
    return ipAddressDetails
      .filter(({ usageDetails }) => isNull(usageDetails)
        && !this.UNAVAILABLE_IP_STATUSES.includes(usageDetails)
        && !this.MAC_ADDRESS_REG_EXP.test(usageDetails));
  }

  goToPreviousStep() {
    return this.$state.go(
      'app.dedicatedClouds.datacenter.drp',
      { selectedDrpType: this.drpInformations.drpType },
      { reload: true },
    );
  }

  goToNextStep() {
    return this.$state.go(`app.dedicatedClouds.datacenter.drp.${this.drpInformations.drpType}.secondPccStep`, { drpInformations: this.drpInformations });
  }
}
