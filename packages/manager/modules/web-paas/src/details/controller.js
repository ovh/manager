export default class {
  /* @ngInject */
  constructor(Alerter) {
    this.Alerter = Alerter;
  }

  $onInit() {
    this.Alerter.alertFromSWS('message', 'success', 'web_paas_dashboard_alert');
    this.alerts = {
      dashboard: 'web_paas_dashboard_alert',
    };
  }
}
