export default class {
  /* @ngInject */
  constructor(Alerter) {
    this.Alerter = Alerter;
  }

  $onInit() {
    this.alerts = {
      dashboard: 'web_paas_dashboard_alert',
    };
  }
}
