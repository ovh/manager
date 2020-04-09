import controller from './statistics.controller';
import template from './statistics.html';

export default {
  bindings: {
    goBack: '<',
    ip: '<',
    ipBlock: '<',
  },
  controller,
  template,
};
