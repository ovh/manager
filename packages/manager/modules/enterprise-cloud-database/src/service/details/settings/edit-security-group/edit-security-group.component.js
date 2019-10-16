import controller from './edit-security-group.controller';
import template from './edit-security-group.html';

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
