import controller from './delete-archive.controller';
import template from './delete-archive.html';

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
