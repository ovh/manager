import get from 'lodash/get';
import { ADDON_TYPE, STORAGE_MULTIPLE } from '../../web-paas.constants';

export default class WebPassDetailsServiceCtrl {
  /* @ngInject */
  constructor(Alerter) {
    this.Alerter = Alerter;
    this.ADDON_TYPE = ADDON_TYPE;
    this.STORAGE_MULTIPLE = STORAGE_MULTIPLE;
  }

  isAdmin() {
    return this.project.getAccountName() === this.user.nichandle;
  }

  $onInit() {
    this.WEB_PAAS_TRACK_OPEN_PSH = `${this.webPaasDashboardPrefix}goto-platform-sh-project`;
    this.WEB_PAAS_TRACK_CHANGE_OFFER = `${this.webPaasDashboardPrefix}change-range`;
    this.WEB_PAAS_TRACK_CHANGE_VCPU = `${this.webPaasDashboardPrefix}setup-vcpus`;
    this.WEB_PAAS_TRACK_ADDON_STORAGE = `${this.webPaasDashboardPrefix}upgrade-storage`;
    this.WEB_PAAS_TRACK_ADDON_LICENSE = `${this.webPaasDashboardPrefix}setup-user`;
    this.WEB_PAAS_TRACK_ADDON_ENVIRONMENT = `${this.webPaasDashboardPrefix}setup-additional-environments`;
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
