import controller from './instances-table.controller';
import template from './instances-table.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    region: '<',
    listeners: '=',
    maxListener: '<',
    maxInstancesByListener: '<',
    trackingPrefix: '<',
  },
};
