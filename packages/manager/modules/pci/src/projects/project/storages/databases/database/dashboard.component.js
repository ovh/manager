import template from './dashboard.html';

export default {
  bindings: {
    allowedIpsLink: '<',
    backupsLink: '<',
    currentActiveLink: '<',
    database: '<',
    databaseGuideUrl: '<',
    generalInformationLink: '<',
    guideUrl: '<',
    usersLink: '<',
    logsLink: '<',
    metricsLink: '<',
    databasesLink: '<',
    aclLink: '<',
    userAclLink: '<',
    topicsLink: '<',
    indexesLink: '<',
    serviceIntegrationLink: '<',
    replicationsLink: '<',
    trackDashboard: '<',
    trackDatabases: '<',
    isFeatureActivated: '<',
  },
  template,
};
