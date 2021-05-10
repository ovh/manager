import get from 'lodash/get';
import { ADDON_TYPE } from './service.constants';

export default class WebPassDetailsServiceCtrl {
  /* @ngInject */
  constructor(Alerter) {
    this.Alerter = Alerter;
    this.ADDON_TYPE = ADDON_TYPE;
  }

  onBillingInformationError(error) {
    return this.Alerter.alertFromSWS(
      `${this.$translate.instant('web_paas_tile_billing_error')} ${get(
        error,
        'data.message',
      )}`,
      error,
      'web_paas_dashboard_alert',
    );
  }
}
