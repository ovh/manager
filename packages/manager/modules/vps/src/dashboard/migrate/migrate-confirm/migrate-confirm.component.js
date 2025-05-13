import controller from './migrate-confirm.controller';
import template from './migrate-confirm.html';

export default {
  bindings: {
    getRebootLink: '<',
    goBack: '<',
    goBackToMigrate: '<',
    migrationConfirmTrackingPrefix: '<',
    stateVps: '<',
    serviceName: '<',
    selectedPlan: '<',
  },
  controller,
  template,
};
