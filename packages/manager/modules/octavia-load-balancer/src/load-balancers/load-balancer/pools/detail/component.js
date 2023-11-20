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
    trackDetailAction: '<',
    trackDetailPage: '<',
    goBack: '<',
  },
  template,
};
