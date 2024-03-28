import controller from './controller';
import template from './template.html';

export default {
  controller,
  template,
  bindings: {
    datacenters: '<',
    productId: '<',
    goBack: '<',
  },
  name: 'ovhManagerPccVmwareCloudDirectorOrder',
};
