import controller from './migrate.controller';
import template from './migrate.html';

export default {
  bindings: {
    catalog: '<',
    goBack: '<',
    goToMigrateConfirm: '<',
    migrationTrackingPrefix: '<',
    newPlan: '<',
    currentPrice: '<',
    newPrice: '<',
    serviceName: '<',
    stateVps: '<',
    vps: '<',
    vpsMigration: '<',
    user: '<',
  },
  controller,
  template,
};
