import controller from './iplb-server-delete.controller';
import template from './iplb-server-delete.html';

export default {
  bindings: {
    goBack: '<',
    farm: '<',
    server: '<',
    serviceName: '<',
  },
  controller,
  template,
};
