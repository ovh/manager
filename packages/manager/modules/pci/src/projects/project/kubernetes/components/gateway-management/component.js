import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    network: '<',
    elevateTitle: '<',
  },
  controller,
  template,
};
