import template from './template.html';
import controller from './controller.js';

export default {
  template,
  controller,
  bindings: {
    server: '<',
    guideUrl: '@',
    ola: '<',
  },
};
