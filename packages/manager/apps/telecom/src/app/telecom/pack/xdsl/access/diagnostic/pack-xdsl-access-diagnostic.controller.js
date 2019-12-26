angular.module('managerApp').controller(
  'XdslDiagnosticCtrl',
  class XdslDiagnosticCtrl {
    constructor($stateParams) {
      this.lineNumber = $stateParams.number;
      this.serviceName = $stateParams.serviceName;
    }
  },
);
