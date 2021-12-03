import controller from './current-queries.controller';
import template from './current-queries.html';

export default {
  bindings: {
    database: '<',
    projectId: '<',
    trackDashboard: '<',
  },
  controller,
  template,
};
