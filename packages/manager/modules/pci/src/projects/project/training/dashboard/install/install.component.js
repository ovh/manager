import controller from './install.controller';
import template from './install.html';

export default {
  controller,
  template,
  bindings: {
    userLink: '<',
    goToDashboard: '<',
    goBack: '<',
    regions: '<',
  },
};
