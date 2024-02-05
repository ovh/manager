import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    poolId: '<',
    pool: '<',
    algorithms: '<',
    poolProtocols: '<',
    sessionPersistenceTypes: '<',
    trackEditAction: '<',
    trackEditPage: '<',
    goBack: '<',
  },
  controller,
  template,
};
