import controller from './accept-all.controller';
import template from './accept-all.html';

export default {
  bindings: {
    agreements: '<',
    goBack: '<',
  },
  controller,
  template,
};
