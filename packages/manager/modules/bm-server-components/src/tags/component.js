import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    server: '<',
    goToAssignTags: '<',
    goToUnassignTags: '<',
    goToViewTagDetails: '<',
  },
  controller,
  template,
};
