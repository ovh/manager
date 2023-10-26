import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    loadbalancerId: '<',
    pools: '<',
    trackAction: '<',
    goBack: '<',
  },
  controller,
  template,
};
