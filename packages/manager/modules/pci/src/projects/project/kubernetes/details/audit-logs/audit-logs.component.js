import controller from './audit-logs.controller';
import template from './audit-logs.html';

const auditLogsComponent = {
  bindings: {
    projectId: '<',
    kubeId: '<',
    goToListingPage: '<',
    logKindsList: '<',
    kind: '<',
  },
  controller,
  template,
};

export default auditLogsComponent;
