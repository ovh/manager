import 'moment';
import {
  SERVICE_TYPE,
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
  NETWORK_STATUS,
} from '../constants';

export default class OvhManagerNetAppDashboardIndexCtrl {
  /* @ngInject */
  constructor($translate, Alerter, NetAppDashboardService) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.NetAppDashboardService = NetAppDashboardService;

    this.SERVICE_TYPE = SERVICE_TYPE;
    this.NETWORK_STATUS = NETWORK_STATUS;
  }

  $onInit() {
    this.commitImpressionData = this.shouldReengage()
      ? RECOMMIT_IMPRESSION_TRACKING_DATA
      : COMMIT_IMPRESSION_TRACKING_DATA;

    if (this.isNetworkAvailable) {
      this.populateAttachedSubnetAndEndpoint();

      if (
        this.networkInformations.status === this.NETWORK_STATUS.TO_CONFIGURE
      ) {
        this.NetAppDashboardService.startNetworkPolling(this.storage).then(
          ([data]) => {
            this.NetAppDashboardService.populateStorageNetwork(data).then(
              (network) => {
                this.networkInformations = network;
                this.populateAttachedSubnetAndEndpoint();
              },
            );
          },
        );
      }
    }
  }

  populateAttachedSubnetAndEndpoint() {
    ({
      attachedSubnet: this.attachedSubnet,
      attachedEndpoint: this.serviceEndpoint,
    } = this.NetAppDashboardService.constructor.getAttachedSubnetAndEndpoint(
      this.networkInformations,
      this.storage,
    ));
  }

  $onDestroy() {
    this.NetAppDashboardService.stopNetworkPolling(this.storage);
  }

  shouldReengage() {
    return (
      this.serviceInfos.engagedUpTo &&
      moment(this.serviceInfos.engagedUpTo).diff(moment(), 'month') < 3
    );
  }

  onBillingInformationError(error) {
    this.Alerter.error(error);
  }
}
