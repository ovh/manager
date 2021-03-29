import controller from './audit-logs.controller';
import template from './audit-logs.html';

const auditLogsComponent = {
  bindings: {
    projectId: '<',
    kubeId: '<',
  },
  controller,
  template,
};

export default auditLogsComponent;
