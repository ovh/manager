import template from './logs.template.html';
import controller from './logs.controller';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    loadbalancerId: '<',
    goToListingPage: '<',
    logKindsList: '<',
    kind: '<',
    trackClick: '<',
  },
  template,
  controller,
};
