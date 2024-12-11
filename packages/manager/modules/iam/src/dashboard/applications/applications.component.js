import controller from './applications.controller';
import template from './applications.template.html';

export default {
  bindings: {
    applications: '<',
    alert: '<',
    goTo: '<',
    trackClick: '<',
  },
  controller,
  template,
};
