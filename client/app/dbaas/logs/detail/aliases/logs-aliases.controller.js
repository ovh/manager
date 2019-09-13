class LogsAliasesCtrl {
  constructor($state, $stateParams) {
    this.$state = $state;
    this.$stateParams = $stateParams;
  }
}

angular.module('managerApp').controller('LogsAliasesCtrl', LogsAliasesCtrl);
