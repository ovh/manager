import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    loadbalancerId: '<',
    algorithms: '<',
    poolProtocols: '<',
    sessionPersistenceTypes: '<',
    trackCreateAction: '<',
    trackCreatePage: '<',
    goBack: '<',
  },
  controller,
  template,
};
