import moment from 'moment';
import {
  PREFIX_TRACKING_DASHBOARD,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
  COMMIT_IMPRESSION_TRACKING_DATA,
} from './dashboard.constants';

export default class NashaDashboardController {
  constructor() {
    this.RECOMMIT_IMPRESSION_TRACKING_DATA = RECOMMIT_IMPRESSION_TRACKING_DATA;
    this.COMMIT_IMPRESSION_TRACKING_DATA = COMMIT_IMPRESSION_TRACKING_DATA;
  }

  get name() {
    return this.nasha.customName || this.nasha.serviceName;
  }

  onClickOnGoToPartitionsCreate() {
    this.trackClick(PREFIX_TRACKING_DASHBOARD, 'create-partition');
    return this.goToPartitionsCreate();
  }

  shouldReengage() {
    return (
      this.serviceInfo.engagedUpTo &&
      moment(this.serviceInfo.engagedUpTo).diff(moment(), 'month') < 3
    );
  }
}
