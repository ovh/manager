import controller from './move.controller';
import template from './move.html';

export default {
  bindings: {
    goBack: '<',
    ipBlock: '<',
  },
  controller,
  template,
};
