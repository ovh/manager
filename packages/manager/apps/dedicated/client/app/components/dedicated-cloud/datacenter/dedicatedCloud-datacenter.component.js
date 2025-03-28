import controller from './dedicatedCloud-datacenter.controller';
import template from './dedicatedCloud-datacenter.html';

export default {
  bindings: {
    datacenter: '<',
    editDetails: '<',
    backupState: '<',
    dashboardState: '<',
    datastoresState: '<',
    drpAvailability: '<',
    drpState: '<',
    virtualMachinesState: '<',
    hostsState: '<',
    newProductUrl: '<',
    dedicatedCloudPCCMigrationState: '<?',
    dedicatedCloudVCDMigrationState: '<?',
    vcdTrackingPrefix: '<?',
  },
  controller,
  template,
};
