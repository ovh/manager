import controller from './upgrade-plan.controller';
import template from './upgrade-plan.html';

export default {
  bindings: {
    cancelLink: '<',
    goBackToList: '<',
    plans: '<',
    projectId: '<',
    registryId: '<',
    user: '<',
  },
  controller,
  template,
};
