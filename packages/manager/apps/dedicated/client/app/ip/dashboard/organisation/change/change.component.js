import controller from './change.controller';
import template from './change.html';

export default {
  bindings: {
    goBack: '<',
    ipBlock: '<',
  },
  controller,
  template,
};
