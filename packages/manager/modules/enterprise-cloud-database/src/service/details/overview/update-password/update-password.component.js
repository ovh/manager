import controller from './update-password.controller';
import template from './update-password.html';

const component = {
  bindings: {
    clusterId: '<',
    goBack: '<',
    goToOverview: '<',
  },
  controller,
  template,
};

export default component;
