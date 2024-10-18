import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goToVcdOrder: '<',
    productId: '<',
    trackingPrefix: '<',
    vcdMigrationState: '<',
  },
  name: 'ovhManagerPccDashboardVmwareCloudDirector',
  controller,
  template,
};
