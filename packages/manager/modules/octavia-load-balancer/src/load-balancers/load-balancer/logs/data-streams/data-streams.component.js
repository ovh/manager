import controller from './data-streams.controller';
import template from './data-streams.template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    loadbalancerId: '<',
    kind: '<',
    goBack: '<',
    trackClick: '<',
  },
  controller,
  template,
};
