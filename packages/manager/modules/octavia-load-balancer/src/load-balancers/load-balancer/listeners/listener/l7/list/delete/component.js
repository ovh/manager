import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    policyId: '<',
    policyName: '<',
    goBack: '<',
    trackL7PolicyDeleteAction: '<',
    trackL7PolicyDeletePage: '<',
  },
  controller,
  template,
};
