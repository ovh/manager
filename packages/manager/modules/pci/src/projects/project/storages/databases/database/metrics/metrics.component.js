import controller from './metrics.controller';
import template from './metrics.html';

export default {
  bindings: {
    projectId: '<',
    trackDatabases: '<',
  },
  controller,
  template,
};
