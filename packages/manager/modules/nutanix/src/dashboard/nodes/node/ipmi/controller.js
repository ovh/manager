export default class NutanixNodeIpmiCtrl {
  /* @ngInject */
  constructor($translate, coreConfig, Alerter) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.user = this.coreConfig.getUser();
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
