import controller from './summary-configuration.controller';

import template from './summary-configuration.html';

export default {
  bindings: {
    configuration: '<',
    connectedUser: '<',
    highlight: '<',
    summaryTitle: '@',
  },
  controller,
  template,
};
