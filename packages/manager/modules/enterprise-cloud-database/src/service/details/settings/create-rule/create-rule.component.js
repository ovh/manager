import controller from './create-rule.controller';
import template from './create-rule.html';

const component = {
  template,
  controller,
  bindings: {
    clusterId: '<',
    goBack: '<',
    securityGroup: '<',
  },
};

export default component;
