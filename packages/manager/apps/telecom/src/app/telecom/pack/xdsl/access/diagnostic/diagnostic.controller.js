export default class XdslDiagnosticCtrl {
  /* @ngInject */
  constructor($stateParams) {
    this.lineNumber = $stateParams.number;
    this.serviceName = $stateParams.serviceName;
  }
}
