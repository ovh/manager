import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    trackingPrefix: '<',
    pccMigrationState: '<',
    vcdMigrationState: '<',
  },
  controller,
  template,
  name: 'ovhManagerPccManagedVcdMigrationBanner',
};
