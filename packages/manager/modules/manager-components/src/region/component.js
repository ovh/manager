import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    regions: '<',
    model: '=',
  },
  controller,
  template,
};
