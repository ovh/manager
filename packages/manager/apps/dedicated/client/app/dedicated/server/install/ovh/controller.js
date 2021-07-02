export default class DedicatedServerInstallOvhCtrl {
  /* @ngInject */
  constructor(Alerter) {
    this.Alerter = Alerter;
  }

  handleError(error) {
    this.Alerter.error(
      error.message || error.data?.message,
      'server_dashboard_alert',
    );
  }
}
