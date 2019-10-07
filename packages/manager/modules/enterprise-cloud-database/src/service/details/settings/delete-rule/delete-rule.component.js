import controller from './delete-rule.controller';
import template from './delete-rule.html';

const component = {
  template,
  controller,
  bindings: {
    clusterId: '<',
    goBack: '<',
    rule: '<',
    securityGroup: '<',
  },
};

export default component;
