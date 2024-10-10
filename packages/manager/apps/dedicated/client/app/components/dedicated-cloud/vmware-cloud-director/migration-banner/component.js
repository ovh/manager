import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    trackingPrefix: '<',
    pccMigrationState: '<',
    vcdMigrationState: '<',
    hasVcdMigration: '<',
  },
  controller,
  template,
  name: 'ovhManagerPccManagedVcdMigrationBanner',
};
