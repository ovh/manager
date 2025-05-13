import controller from './history.controller';
import template from './history.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
  },
};
