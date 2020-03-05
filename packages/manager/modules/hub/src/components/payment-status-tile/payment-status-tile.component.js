import controller from './payment-status-tile.controller';
import template from './payment-status-tile.html';

export default {
  bindings: {
    refresh: '&',
    services: '<',
    totalCount: '<',
    trackingPrefix: '@?',
  },
  controller,
  template,
};
