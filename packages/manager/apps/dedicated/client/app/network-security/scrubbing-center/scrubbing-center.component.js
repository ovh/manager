import controller from './scrubbing-center.controller';
import template from './scrubbing-center.html';

export default {
  bindings: {
    cursors: '<',
    showStats: '<',
    getIp: '<',
    goTo: '<',
  },
  controller,
  template,
};
