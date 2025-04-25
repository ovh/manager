import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    storage: '<',
    volume: '<',
    goBack: '<',
  },
  template,
  controller,
};
