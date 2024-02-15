import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    loadbalancerId: '<',
    currentActiveLink: '<',
    generalInformationPoolsDetailLink: '<',
    healthMonitorPoolsDetailLink: '<',
    membersPoolsDetailLink: '<',
    pool: '<',
    members: '<',
    trackDetailAction: '<',
    trackDetailPage: '<',
    goBack: '<',
  },
  template,
};
