import template from './data-processing-jobs.html';
import controller from './data-processing-jobs.controller';

export default {
  template,
  controller,
  bindings: {
    pciFeatureRedirect: '<',
    jobs: '<',
    submitJob: '<',
    showJob: '<',
    showJobs: '<',
    projectId: '<',
    terminateJob: '<',
    getPricesFromCatalog: '<',
    jobId: '<',
    onListParamChange: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
  },
};
