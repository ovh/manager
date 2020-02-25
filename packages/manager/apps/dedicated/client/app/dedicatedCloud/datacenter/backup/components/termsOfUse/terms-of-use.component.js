import controller from './terms-of-use.controller';
import template from './terms-of-use.html';

export default {
  bindings: {
    datacenterId: '@',
    mode: '@',
    model: '=',
  },
  controller,
  template,
};
