class LogsStreamsCtrl {
  constructor($stateParams) {
    this.$stateParams = $stateParams;
  }
}

angular.module('managerApp').controller('LogsStreamsCtrl', LogsStreamsCtrl);
