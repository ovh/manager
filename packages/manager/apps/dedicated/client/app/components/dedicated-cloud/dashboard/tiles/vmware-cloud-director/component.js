import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goToVcdOrder: '<',
    productId: '<',
    trackingPrefix: '<',
    pccMigrationState: '<',
  },
  name: 'ovhManagerPccDashboardVmwareCloudDirector',
  controller,
  template,
};
