import controller from './resourceGroups.controller';
import template from './resourceGroups.template.html';

export default {
  bindings: {
    alert: '<',
    cursors: '<',
    goTo: '<',
    trackClick: '<',
  },
  controller,
  template,
};
