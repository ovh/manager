import template from './summary-configuration.html';

export default {
  bindings: {
    configuration: '<',
    connectedUser: '<',
    highlight: '<',
    summaryTitle: '@',
  },
  template,
};
