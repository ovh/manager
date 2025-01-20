import template from './nodes.html';
import controller from './nodes.controller.js';

export default {
  bindings: {
    nodes: '<',
    getNodeDashboardLink: '<',
  },
  template,
  controller,
};
