import template from './creating.html';
import controller from './creating.controller';

export default {
  template,
  controller,
  bindings: {
    pciFeatureRedirect: '<',
    guideUrl: '<',
    projectId: '<',
    project: '<',
    projects: '<',
    projectOrderStatus: '<',
    onProjectCreated: '<',
  },
};
