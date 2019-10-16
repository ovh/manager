import controller from './add-replicas.controller';
import template from './add-replicas.html';

const component = {
  template,
  controller,
  bindings: {
    availableReplicas: '<',
    clusterId: '<?',
    createReplicas: '<?',
    callback: '<?',
    defaultPaymentMethod: '<',
    hostList: '<',
    goBack: '<',
    maxHostCount: '<',
    nodeCatalog: '<',
    orderUrl: '<?',
    user: '<',
  },
};

export default component;
