import controller from './delete-security-group.controller';
import template from './delete-security-group.html';

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
