import template from './template.html';
import controller from './diagnostics.controller';

export default {
  bindings: {
    cloudConnect: '<',
    refreshDiagnostics: '<',
    diagnosticList: '<',
    gotoDiagnosticResult: '<',
    fromLink: '<',
  },
  controller,
  template,
};
