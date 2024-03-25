import 'moment';
import {
  SERVICE_TYPE,
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
} from '../constants';
import { PATTERN } from './constants';

export default class OvhManagerNetAppDashboardIndexCtrl {
  /* @ngInject */
  constructor(Alerter, OvhManagerNetAppDashboardIndex) {
    this.Alerter = Alerter;
    this.OvhManagerNetAppDashboardIndex = OvhManagerNetAppDashboardIndex;

    this.SERVICE_TYPE = SERVICE_TYPE;
    this.PATTERN = PATTERN;
  }

  $onInit() {
    this.commitImpressionData = this.shouldReengage()
      ? RECOMMIT_IMPRESSION_TRACKING_DATA
      : COMMIT_IMPRESSION_TRACKING_DATA;
    this.editNameValue = this.storage.name;
  }

  shouldReengage() {
    return (
      this.serviceInfos.engagedUpTo &&
      moment(this.serviceInfos.engagedUpTo).diff(moment(), 'month') < 3
    );
  }

  editName() {
    this.OvhManagerNetAppDashboardIndex.updateStorage(
      this.storage.id,
      this.storage.name,
    ).then(() => {
      window.location.reload();
    });
  }

  onBillingInformationError(error) {
    this.Alerter.error(error);
  }
}
