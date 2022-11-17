import controller from './archive.controller';
import template from './archive.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    containerName: '<',
    trackClick: '<',
    trackPage: '<',
    goBack: '<',
  },
};
