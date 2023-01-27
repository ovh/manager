import template from './data-processing-home.html';
import controller from './data-processing-home.controller';

export default {
  template,
  controller,
  bindings: {
    submitJob: '<',
    showJobs: '<',
    projectId: '<',
    addNotebook: '<',
    trackClick: '<',
    showNotebooks: '<',
  },
};
