import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    loadbalancerId: '<',
    pools: '<',
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
