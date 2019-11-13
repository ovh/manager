import get from 'lodash/get';
import isNull from 'lodash/isNull';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP,
  DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
} from '../../../dedicatedCloud-datacenter-drp.constants';

export default class {
  /* @ngInject */
  constructor(
    $q, $timeout, $translate, $window,
    Alerter, DedicatedCloud, dedicatedCloudDrp, ipFeatureAvailability,
    OvhApiDedicatedCloud, ovhUserPref,
    DEDICATED_CLOUD_CONSTANTS,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.DedicatedCloud = DedicatedCloud;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.ipFeatureAvailability = ipFeatureAvailability;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.ovhUserPref = ovhUserPref;
    this.MAC_ADDRESS_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP;
    this.PCC_NEW_GENERATION = DEDICATED_CLOUD_CONSTANTS.pccNewGeneration;
    this.UNAVAILABLE_IP_STATUSES = DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS;
  }

  updateOptions(secondaryPcc) {
    this.isFetchingOptions = true;

    this.drpInformations.secondaryPcc = secondaryPcc;
    this.drpInformations.secondaryDatacenter = null;
    this.selectedSecondaryIpAddress = null;

    this.OvhApiDedicatedCloud.Ip().v6().resetQueryCache();
    this.OvhApiDedicatedCloud.Ip().v6().resetCache();

    return this.$q.all({
      datacenters: this.DedicatedCloud.getDatacenters(secondaryPcc.serviceName),
      ipAddressDetails: this.dedicatedCloudDrp.getPccIpAddressesDetails(secondaryPcc.serviceName),
    })
      .then(({ datacenters, ipAddressDetails }) => {
        this.availableDatacenters = datacenters.results;
        this.availableIpAddress = ipAddressDetails
          .filter(({ usageDetails }) => isNull(usageDetails)
            && !this.UNAVAILABLE_IP_STATUSES.includes(usageDetails)
            && !this.MAC_ADDRESS_REG_EXP.test(usageDetails));
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_get_state_error')} ${get(error, 'data.message', error)}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.isFetchingOptions = false;
      });
  }

  checkIfDatacenterHasHosts(datacenterId) {
    this.isCheckingHosts = true;
    this.isSecondaryDatacenterWithoutHosts = false;
    this.hostsStateLink = '';

    return this.DedicatedCloud.getHosts(
      this.drpInformations.secondaryPcc.serviceName,
      datacenterId,
    )
      .then(({ length: hostsCount }) => {
        this.isSecondaryDatacenterWithoutHosts = hostsCount === 0;
        if (this.isSecondaryDatacenterWithoutHosts) {
          this.hostsStateLink = `app.dedicatedClouds.datacenter.hosts({ productId: '${this.drpInformations.secondaryPcc.serviceName}', datacenterId: ${datacenterId} })`;
        }
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_secondary_datacenter_get_hosts_error')} ${get(error, 'data.message', '')}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.isCheckingHosts = false;
      });
  }

  isStepValid() {
    return this.selectedSecondaryPcc
      && this.drpInformations.secondaryDatacenter
      && this.selectedSecondaryIpAddress;
  }

  validateConfiguration() {
    this.isLoading = true;

    return this.dedicatedCloudDrp.enableDrp(
      this.drpInformations,
      this.drpInformations.primaryPcc.generation !== this.PCC_NEW_GENERATION,
    )
      .then((enableDrp) => {
        if (enableDrp.url !== undefined) {
          this.storeZertoOptionOrderInUserPref(this.drpInformations, enableDrp);
          if (!enableDrp.hasAutoPay) {
            this.$window.open(enableDrp.url, '_blank');
          }
        }

        return this.goToPccDashboard(true)
          .then(() => {
            // $timeout necessary to display alerter message
            this.$timeout(() => {
              if (!enableDrp.hasAutoPay) {
                this.displaySuccessMessage(`${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_order', { billUrl: enableDrp.url })}`);
              } else {
                this.displayInfoMessage(`
                    ${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_creation_pending')} ${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_creation_pending_task')}
                `);
              }
            });
          });
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_error')} ${get(error, 'data.message', error.message)}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
