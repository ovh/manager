import template from './logs.template.html';

export const name = 'iamLogs';

export default {
  template,
  bindings: {
    auditLogsAvailability: '<',
    activityLogsAvailability: '<',
    accessPolicyLogsAvailability: '<',
    onboardingGuides: '<',
  },
};
