import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goToVcdOrder: '<',
    productId: '<',
  },
  name: 'ovhManagerPccDashboardVmwareCloudDirector',
  controller,
  template,
};
