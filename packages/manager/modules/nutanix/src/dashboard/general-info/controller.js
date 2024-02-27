import {
  TRAVAUX_LINK,
  PRIVATE_BANDWIDTH_SERVICE_PREFIX,
  REPLICATION_FACTOR_PREFIX,
  TYPE_OF_PACK,
  NUTANIX_INVOICE_TYPE,
  NUTANIX_PERSONAL_LICENSE_EDITION,
  GENERAL_INFO_TILE_TITLE,
  GUIDE_PACKAGES_URL,
  TRACKING,
} from './constants';
import { CLUSTER_STATUS } from '../../constants';

export default class NutanixGeneralInfoCtrl {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    coreConfig,
    ovhManagerRegionService,
    NutanixService,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.TRAVAUX_LINK =
      TRAVAUX_LINK[coreConfig.getRegion()] || TRAVAUX_LINK.DEFAULT;
    this.NUTANIX_LINK =
      GUIDE_PACKAGES_URL[coreConfig.getUser().ovhSubsidiary] ||
      GUIDE_PACKAGES_URL.DEFAULT;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.NutanixService = NutanixService;
    this.REPLICATION_FACTOR_PREFIX = REPLICATION_FACTOR_PREFIX;
    this.NUTANIX_PERSONAL_LICENSE_EDITION = NUTANIX_PERSONAL_LICENSE_EDITION;
    this.GENERAL_INFO_TILE_TITLE = GENERAL_INFO_TILE_TITLE;
  }

  $onInit() {
    this.loadServicesDetails();
    this.clusterTechnicalDetails = this.getTechnicalDetails.nutanixCluster;
    this.technicalDetails = this.getTechnicalDetails.baremetalServers;
    this.setPrivateBandwidthServiceId();
    this.clusterRedeploying = this.cluster.status === CLUSTER_STATUS.DEPLOYING;
    this.showRedeployWarningModal = false;
    this.TRACKING = TRACKING;
  }

  loadServicesDetails() {
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
    } else if (
      this.nutanixPlanDetails.invoiceName.includes(
        NUTANIX_INVOICE_TYPE.ADVANCED,
      )
    ) {
      this.typeOfPack = TYPE_OF_PACK.ADVANCED_PACK;
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

  redeployCluster() {
    if (
      this.clusterTechnicalDetails.license.edition !==
        this.NUTANIX_PERSONAL_LICENSE_EDITION &&
      !this.showRedeployWarningModal
    ) {
      return this.goToRedeploy();
    }
    this.showRedeployWarningModal = true;
    return null;
  }

  onCancel() {
    this.showRedeployWarningModal = false;
  }
}
