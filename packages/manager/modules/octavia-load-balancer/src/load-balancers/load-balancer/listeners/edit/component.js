import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    loadbalancerId: '<',
    listener: '<',
    pools: '<',
    trackEditAction: '<',
    trackEditPage: '<',
    goBack: '<',
  },
  controller,
  template,
};
