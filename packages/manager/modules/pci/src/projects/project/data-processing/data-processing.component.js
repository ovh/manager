import controller from './data-processing.controller';
import template from './data-processing.html';

export default {
  controller,
  template,
  bindings: {
    pciFeatureRedirect: '<',
    homeLink: '<',
    jobsLink: '<',
    notebooksLink: '<',
    currentActiveLink: '<',
    trackClick: '<',
  },
};
