import template from './software-update.html';
import controller from './software-update.controller';

export default {
  bindings: {
    availableVersions: '<',
    displayAlerterMessage: '<',
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
