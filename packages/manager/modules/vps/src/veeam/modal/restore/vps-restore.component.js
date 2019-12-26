import controller from './vps-restore.controller';
import template from './vps-restore.html';

export default {
  bindings: {
    goBack: '<',
    restorePoint: '<',
    serviceName: '<',
  },
  controller,
  template,
};
