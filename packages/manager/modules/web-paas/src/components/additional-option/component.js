import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    disabled: '<',
    option: '<',
    plan: '<',
    project: '<',
    onChange: '&',
  },
  controller,
  template,
};
