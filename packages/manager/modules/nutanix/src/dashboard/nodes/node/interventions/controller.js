export default class NutanixNodeInterventionsCtrl {
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
}
