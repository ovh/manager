export default class LogsStreamsAlertsCtrl {
  /* @ngInject */
  constructor($stateParams) {
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.stream = this.$stateParams.streamId;
  }
}
