import { TRAVAUX_LINK, PRIVATE_BANDWIDTH_SERVICE_PREFIX } from './constants';
import { CLUSTER_STATUS } from '../../constants';

export default class NutanixGeneralInfoCtrl {
  /* @ngInject */
  constructor($translate, atInternet, ovhManagerRegionService, NutanixService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.TRAVAUX_LINK = TRAVAUX_LINK;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.NutanixService = NutanixService;
  }

  $onInit() {
    this.loadServcesDetails();
    this.technicalDetails = this.getTechnicalDetails();
    this.setPrivateBandwidthDetails();
    this.clusterRedeploying = this.cluster.status === CLUSTER_STATUS.DEPLOYING;
  }

  loadServcesDetails() {
    this.loadingServicesDetails = true;
    return this.NutanixService.getServicesDetails(this.serviceInfo.serviceId)
      .then((servicesDetails) => {
        this.servicesDetails = servicesDetails;
      })
      .finally(() => {
        this.loadingServicesDetails = false;
      });
  }

  getTechnicalDetails() {
    return this.NutanixService.getClusterHardwareInfo(
      this.serviceInfo.serviceId,
      this.server.serviceId,
    );
  }

  setPrivateBandwidthDetails() {
    const addOn = this.clusterAddOns.find((clusterAddOn) =>
      clusterAddOn.billing?.plan?.code?.startsWith(
        PRIVATE_BANDWIDTH_SERVICE_PREFIX,
      ),
    );
    if (addOn) {
      this.privateBandwidthServiceId = addOn.serviceId;
      this.privateBandwidthPlanCode = addOn.billing.plan.code;
    }
  }

  trackClick(trackText) {
    return this.atInternet.trackClick({
      name: `${this.trackingPrefix}::${trackText}`,
      type: 'action',
    });
  }
}
