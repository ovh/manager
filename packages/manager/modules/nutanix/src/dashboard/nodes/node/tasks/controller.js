export default class NutanixNodeTasksCtrl {
  /* @ngInject */
  constructor(Alerter) {
    this.Alerter = Alerter;
  }

  handleError(error) {
    this.Alerter.error(
      error.message || error.data?.message,
      'nutanix_node_alert',
    );
  }

  handleSuccess(message) {
    this.Alerter.success(message, 'nutanix_node_alert');
  }
}
