import controller from './migrate.controller';
import template from './migrate.html';

export default {
  bindings: {
    catalog: '<',
    goBack: '<',
    goToMigrateConfirm: '<',
    migrationTrackingPrefix: '<',
    newPlan: '<',
    serviceName: '<',
    stateVps: '<',
    vps: '<',
    vpsMigration: '<',
    user: '<',
  },
  controller,
  template,
};
