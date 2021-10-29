import controller from './increase-request.controller';
import template from './increase-request.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    issueTypes: '<',
    projectId: '<',
    region: '<',
    mode: '<',
  },
};
