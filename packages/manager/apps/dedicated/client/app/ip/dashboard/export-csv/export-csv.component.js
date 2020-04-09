import controller from './export-csv.controller';
import template from './export-csv.html';

export default {
  bindings: {
    goBack: '<',
    ipsList: '<',
  },
  controller,
  template,
};
