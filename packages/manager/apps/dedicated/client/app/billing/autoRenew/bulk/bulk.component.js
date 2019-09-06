import controller from './bulk.controller';
import template from './bulk.html';

export default {
  bindings: {
    description: '@',
    goBack: '&',
    services: '<',
    updateRenew: '&',
  },
  controller,
  template,
  transclude: {
    infoMessage: 'bulkInfoMessage',
    title: 'bulkTitle',
  },
};
