import controller from './load-balancer.controller';
import template from './load-balancer.html';

export default {
  bindings: {
    loadBalancerId: '<?',
    loadBalancers: '<',
    projectId: '<',
    user: '<',
    onListParamChange: '<',
    getStateName: '<',
    steins: '<',
    customerRegions: '<',
    loadBalancersRegions: '<',
    goToRegion: '<',
  },
  controller,
  template,
};
