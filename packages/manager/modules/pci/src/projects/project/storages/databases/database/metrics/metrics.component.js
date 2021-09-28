import controller from './metrics.controller';
import template from './metrics.html';
import './metrics.scss';

export default {
  bindings: {
    projectId: '<',
    trackDatabases: '<',
    availableMetrics: '<',
    database: '<',
  },
  controller,
  template,
};
