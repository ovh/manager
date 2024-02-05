import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    discover: '<',
    goToLoadBalancerCreation: '<',
    goToNoPrivateNetwork: '<',
    hasPrivateNetwork: '<',
  },
  controller,
  template,
};
