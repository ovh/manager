import controller from './dedicatedCloud.controller';
import template from './dedicatedCloud.html';

export default {
  bindings: {
    datacentersState: '<',
    dedicatedCloud: '<',
    editDetails: '<',
    licenseState: '<',
    operationState: '<',
    pccDashboardState: '<',
    productId: '<',
    securityState: '<',
    setMessage: '<',
    usersState: '<',
    dedicatedCloudVCDMigrationState: '<',
    dedicatedCloudPCCMigrationState: '<',
    hasVCDMigration: '<',
    vcdTrackingPrefix: '<',
    customerSurveyBannerAvailability: '<',
    goBackToList: '<',
  },
  controller,
  template,
};
