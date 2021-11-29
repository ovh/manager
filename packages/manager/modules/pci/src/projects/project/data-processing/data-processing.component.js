import template from './data-processing.html';
import controller from './data-processing.controller';

export default {
  template,
  controller,
  bindings: {
    pciFeatureRedirect: '<',
    jobs: '<',
    submitJob: '<',
    showJob: '<',
    projectId: '<',
    terminateJob: '<',
    getPricesFromCatalog: '<',
    jobId: '<',
    onListParamChange: '<',
  },
};
