import 'moment';
import {
  SERVICE_TYPE,
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
  NETWORK_STATUS,
} from '../constants';

export default class OvhManagerNetAppDashboardIndexCtrl {
  /* @ngInject */
  constructor($translate, Alerter) {
    this.$translate = $translate;
    this.Alerter = Alerter;

    this.SERVICE_TYPE = SERVICE_TYPE;
    this.NETWORK_STATUS = NETWORK_STATUS;
  }

  $onInit() {
    this.commitImpressionData = this.shouldReengage()
      ? RECOMMIT_IMPRESSION_TRACKING_DATA
      : COMMIT_IMPRESSION_TRACKING_DATA;
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
