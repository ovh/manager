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
  },
  controller,
  template,
};
