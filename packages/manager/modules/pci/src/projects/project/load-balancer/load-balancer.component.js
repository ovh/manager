import controller from './load-balancer.controller';
import template from './load-balancer.html';

export default {
  bindings: {
    loadBalancerId: '<?',
    loadBalancers: '<',
    projectId: '<',
    user: '<',
    onListParamChange: '<',
  },
  controller,
  template,
};
