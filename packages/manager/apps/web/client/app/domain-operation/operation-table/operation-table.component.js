import template from './operation-table.html';
import controller from './operation-table.controller';

export default {
  template,
  controller,
  bindings: {
    type: '<',
    filters: '=',
    loading: '=',
    operationIds: '=',
    nicOperationEnum: '<',
    operationStatusEnum: '<',
  },
};
