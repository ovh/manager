import controller from './snapshot-delete.controller';
import template from './snapshot-delete.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
