import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    status: '<',
    os: '<',
  },
  template,
  controller,
};
