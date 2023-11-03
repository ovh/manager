import controller from './scrubbing-center.controller';
import template from './scrubbing-center.html';

export default {
  bindings: {
    showStats: '<',
    getIp: '<',
  },
  controller,
  template,
};
