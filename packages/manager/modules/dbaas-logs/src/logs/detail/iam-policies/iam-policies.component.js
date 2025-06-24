import controller from './iam-policies.controller';
import template from './iam-policies.template.html';

export const name = 'dbaasLogsDetailIAMPolicies';

export default {
  bindings: {
    service: '<',
    goTo: '<',
  },
  template,
  controller,
};
