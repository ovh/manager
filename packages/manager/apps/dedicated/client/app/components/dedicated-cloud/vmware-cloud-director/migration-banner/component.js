import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
  name: 'ovhManagerPccManagedVcdMigrationBanner',
};
