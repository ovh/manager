import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    pack: '<',
    service: '<',
  },
  controller,
  template,
};
