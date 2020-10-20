export default /* @ngInject */ class XdslDiagnosticCtrl {
  constructor($stateParams) {
    this.lineNumber = $stateParams.number;
    this.serviceName = $stateParams.serviceName;
  }
}
