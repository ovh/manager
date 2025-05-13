import controller from './dedicatedCloud-operation-executionDateEdit.controller';
import template from './dedicatedCloud-operation-executionDateEdit.html';

export default {
  bindings: {
    goBack: '<',
    operationToEdit: '<',
    productId: '<',
  },
  controller,
  template,
};
