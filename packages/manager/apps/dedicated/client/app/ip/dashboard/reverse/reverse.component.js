import controller from './reverse.controller';
import template from './reverse.html';

export default {
  bindings: {
    goBack: '<',
    ipBlock: '<',
  },
  controller,
  template,
};
