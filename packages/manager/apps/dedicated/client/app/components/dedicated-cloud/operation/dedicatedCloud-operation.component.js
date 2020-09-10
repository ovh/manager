import controller from './dedicatedCloud-operation.controller';
import template from './dedicatedCloud-operation.html';

export default {
  template,
  controller,
  bindings: {
    productId: '<',
    goToDatacenter: '<',
    goToDatastores: '<',
    goToExecutionDateEdit: '<',
    goToHosts: '<',
    goToUsers: '<',
    setMessage: '<',
  },
  name: 'ovhManagerPccOperation',
};
