import controller from './snapshot-restore.controller';
import template from './snapshot-restore.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
