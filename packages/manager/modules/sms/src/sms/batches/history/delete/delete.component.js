import controller from './delete.controller';
import template from './delete.html';

export default {
  bindings: {
    batchId: '<',
    batchName: '<',
    serviceName: '<',
    goBack: '<',
  },
  controller,
  template,
};