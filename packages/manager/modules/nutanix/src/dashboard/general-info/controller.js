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
    this.clusterTechnicalDetails = null;
    this.setPrivateBandwidthServiceId();
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
    this.loadingTechnicalDetails = true;
    return this.NutanixService.getClusterHardwareInfo(
      this.serviceInfo.serviceId,
      this.server.serviceId,
    )
      .then((technicalDetails) => {
        this.clusterTechnicalDetails = technicalDetails.nutanixCluster;
        return technicalDetails.baremetalServers;
      })
      .finally(() => {
        this.loadingTechnicalDetails = false;
      });
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
