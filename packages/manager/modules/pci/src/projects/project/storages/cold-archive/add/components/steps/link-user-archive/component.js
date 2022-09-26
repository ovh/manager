import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    archiveModel: '<',
    userModel: '<',
    users: '<',
    displayLinkUserArchiveStep: '<',
  },
  controller,
  template,
};
