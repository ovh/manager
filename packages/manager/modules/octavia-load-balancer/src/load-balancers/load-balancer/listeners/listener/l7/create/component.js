import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    listenerId: '<',
    redirectHttpCodes: '<',
    pools: '<',
    trackL7CreatePolicyAction: '<',
    trackL7CreatePolicyPage: '<',
    getL7RuleCreationLink: '<',
    goBackToL7PoliciesList: '<',
    displayErrorAlert: '<',
  },
  controller,
  template,
};
