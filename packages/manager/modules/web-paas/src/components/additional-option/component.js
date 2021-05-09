import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    disabled: '<',
    plan: '<',
    project: '<',
    option: '<',
    onChange: '&',
    user: '<',
  },
  controller,
  template,
};
