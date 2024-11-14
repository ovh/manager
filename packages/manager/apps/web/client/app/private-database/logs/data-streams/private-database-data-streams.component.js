import controller from './private-database-data-streams.controller';
import template from './private-database-data-streams.template.html';

export default {
  bindings: {
    projectId: '<',
    kind: '<',
    goBack: '<',
    trackClick: '<',
  },
  controller,
  template,
};
