import controller from './load-balancer.controller';
import template from './load-balancer.html';

export default {
  bindings: {
    pciFeatureRedirect: '<?',
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
