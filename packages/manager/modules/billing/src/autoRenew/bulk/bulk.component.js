import controller from './bulk.controller';
import template from './bulk.html';

export default {
  bindings: {
    descriptions: '<',
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
