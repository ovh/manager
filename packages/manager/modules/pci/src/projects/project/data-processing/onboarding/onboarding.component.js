import template from './onboarding.html';
import controller from './onboarding.controller';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    lab: '<',
    projectId: '<',
    showJobs: '<',
    activateLab: '<',
  },
};
