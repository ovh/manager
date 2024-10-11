import template from './private-database-logs.template.html';
import controller from './private-database-logs.controller';

export default {
  bindings: {
    projectId: '<',
    goToListingPage: '<',
    logKindsList: '<',
    kind: '<',
    trackClick: '<',
  },
  template,
  controller,
};
