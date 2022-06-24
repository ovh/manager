import controller from './migrate.controller';
import template from './migrate.html';

export default {
  bindings: {
    catalog: '<',
    goBack: '<',
    goToMigrateConfirm: '<',
    migrationTrackingPrefix: '<',
    newPlans: '<',
    currentPrice: '<',
    newPrices: '<',
    serviceName: '<',
    stateVps: '<',
    vps: '<',
    vpsMigration: '<',
    user: '<',
    model: '<',
  },
  controller,
  template,
};
