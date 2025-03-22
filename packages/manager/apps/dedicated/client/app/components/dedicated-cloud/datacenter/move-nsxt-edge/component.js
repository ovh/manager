import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    nsxtEdgePreSelected: '<',
    moveNsxtEdge: '<?',
    handleSuccess: '<',
    handleError: '<',
    serviceName: '<',
    datacenterId: '<',
    productId: '<',
  },
  template,
  controller,
};
