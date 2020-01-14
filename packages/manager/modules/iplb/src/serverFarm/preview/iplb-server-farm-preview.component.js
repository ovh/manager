import controller from './iplb-server-farm-preview.controller';
import template from './iplb-server-farm-preview.html';

export default {
  bindings: {
    farm: '<',
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
