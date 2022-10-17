import {
  TRAVAUX_LINK,
  PRIVATE_BANDWIDTH_SERVICE_PREFIX,
  REPLICATION_FACTOR_PREFIX,
  TYPE_OF_PACK,
  NUTANIX_INVOICE_TYPE,
  NUTANIX_COMMERCIAL_NAME,
  NUTANIX_PERSONAL_LICENSE_EDITION,
} from './constants';
import { CLUSTER_STATUS } from '../../constants';

export default class NutanixGeneralInfoCtrl {
  /* @ngInject */
  constructor($translate, atInternet, ovhManagerRegionService, NutanixService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.TRAVAUX_LINK = TRAVAUX_LINK;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.NutanixService = NutanixService;
    this.REPLICATION_FACTOR_PREFIX = REPLICATION_FACTOR_PREFIX;
    this.NUTANIX_PERSONAL_LICENSE_EDITION = NUTANIX_PERSONAL_LICENSE_EDITION;
  }

  $onInit() {
    this.loadServcesDetails();
    this.clusterTechnicalDetails = this.getTechnicalDetails.nutanixCluster;
    this.technicalDetails = this.getTechnicalDetails.baremetalServers;
    this.setPrivateBandwidthServiceId();
    this.clusterRedeploying = this.cluster.status === CLUSTER_STATUS.DEPLOYING;
  }

  loadServcesDetails() {
    this.loadingServicesDetails = true;
    return this.NutanixService.getServicesDetails(this.serviceInfo.serviceId)
      .then((servicesDetails) => {
        this.servicesDetails = servicesDetails;
        this.getPackType();
      })
      .finally(() => {
        this.loadingServicesDetails = false;
      });
  }

  getPackType() {
    this.nutanixPlanDetails = this.nutanixPlans.find(
      (plan) => plan.planCode === this.servicesDetails.billing.plan.code,
    );
    if (
      this.nutanixPlanDetails.invoiceName.includes(
        NUTANIX_INVOICE_TYPE.STANDARD,
      )
    ) {
      this.typeOfPack = TYPE_OF_PACK.STANDARD_PACK;
      this.commercialName = NUTANIX_COMMERCIAL_NAME.STANDARD;
    } else if (
      this.nutanixPlanDetails.invoiceName.includes(
        NUTANIX_INVOICE_TYPE.ADVANCED,
      )
    ) {
      this.typeOfPack = TYPE_OF_PACK.ADVANCED_PACK;
      this.commercialName = NUTANIX_COMMERCIAL_NAME.ADVANCED;
    } else if (
      this.nutanixPlanDetails.invoiceName.includes(NUTANIX_INVOICE_TYPE.BYOL)
    ) {
      this.typeOfPack = TYPE_OF_PACK.BYOL_PACK;
    } else {
      this.typeOfPack = this.nutanixPlanDetails.invoiceName;
    }
  }

  setPrivateBandwidthServiceId() {
    this.privateBandwidthServiceId = this.clusterAddOns.find((addOn) =>
      addOn.billing?.plan?.code?.startsWith(PRIVATE_BANDWIDTH_SERVICE_PREFIX),
    )?.serviceId;
  }

  trackClick(trackText) {
    return this.atInternet.trackClick({
      name: `${this.trackingPrefix}::${trackText}`,
      type: 'action',
    });
  }
}
