import controller from './snapshot-download.controller';
import template from './snapshot-download.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    tabSummary: '<',
  },
  controller,
  template,
};
