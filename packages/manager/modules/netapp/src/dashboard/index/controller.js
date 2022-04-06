import { SERVICE_TYPE } from '../constants';

export default class OvhManagerNetAppDashboardIndexCtrl {
  /* @ngInject */
  constructor($translate, Alerter) {
    this.$translate = $translate;
    this.Alerter = Alerter;

    this.SERVICE_TYPE = SERVICE_TYPE;
  }

  onBillingInformationError(error) {
    this.Alerter.error(error);
  }
}
