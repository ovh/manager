import controller from './activation.controller';
import template from './activation.html';

export default {
  bindings: {
    activateAutorenew: '<',
    goBack: '<',
  },
  controller,
  template,
};
