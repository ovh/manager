import controller from './snapshot-download.controller';
import template from './snapshot-download.html';
import './index.scss';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    tabSummary: '<',
  },
  controller,
  template,
};
