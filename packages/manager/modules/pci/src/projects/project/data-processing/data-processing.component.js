import template from './data-processing.html';
import controller from './data-processing.controller';

export default {
  template,
  controller,
  bindings: {
    jobs: '<',
    submitJob: '<',
    showJob: '<',
    projectId: '<',
    terminateJob: '<',
    getPricesFromCatalog: '<',
  },
};
