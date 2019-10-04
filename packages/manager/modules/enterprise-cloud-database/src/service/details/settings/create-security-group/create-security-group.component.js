import controller from './create-security-group.controller';
import template from './create-security-group.html';

const component = {
  template,
  controller,
  bindings: {
    clusterId: '<',
    goBack: '<',
  },
};

export default component;
