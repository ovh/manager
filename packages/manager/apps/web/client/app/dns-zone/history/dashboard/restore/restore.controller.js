import { ALERT_DNS_RESTORE_ID } from './restore.constants';

export default class RestoreDnsZoneController {
  /* @ngInject */
  constructor($translate, Alerter, DNSZoneService) {
    this.DNSZoneService = DNSZoneService;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  confirmRestoreDnsAtDate() {
    return this.DNSZoneService.restore(this.zoneId, this.chosenDate)
      .then(() =>
        this.goBack(
          this.$translate.instant('dashboard_history_restoration_successful'),
        ),
      )
      .catch(({ data: { message } }) =>
        this.Alerter.error(
          this.$translate.instant('dashboard_history_error', { message }),
          ALERT_DNS_RESTORE_ID,
        ),
      );
  }
}
