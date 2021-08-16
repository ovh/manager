import controller from './history.controller';
import template from './history.html';

export default {
  bindings: {
    monthHistory: '<',
    goToMonth: '<',
    exportToCSV: '<',
    history: '<',
    historyDetails: '<',
    period: '<',
    month: '<',
    year: '<',
  },
  controller,
  template,
};
