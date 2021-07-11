export default class DedicatedServerNetbootCtrl {
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

  handleSuccess(message) {
    this.Alerter.success(
      message,
      'server_dashboard_alert',
    );
  }
}
