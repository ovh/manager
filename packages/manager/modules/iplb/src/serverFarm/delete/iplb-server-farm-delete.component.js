import controller from './iplb-server-farm-delete.controller';
import template from './iplb-server-farm-delete.html';

export default {
  bindings: {
    farm: '<',
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
