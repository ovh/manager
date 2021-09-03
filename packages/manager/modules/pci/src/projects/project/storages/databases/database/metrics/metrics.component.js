import controller from './metrics.controller';
import template from './metrics.html';
import './metrics.scss';

export default {
  bindings: {
    projectId: '<',
    trackDashboard: '<',
    availableMetrics: '<',
    database: '<',
  },
  controller,
  template,
};
