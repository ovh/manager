import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    policy: '<',
    redirectHttpCodes: '<',
    pools: '<',
    trackL7EditPolicyAction: '<',
    trackL7EditPolicyPage: '<',
    goBackToL7PoliciesList: '<',
    displayErrorAlert: '<',
  },
  controller,
  template,
};
