import controller from './iplb-server-edit.controller';
import template from './iplb-server-edit.html';

export default {
  bindings: {
    farmId: '<',
    goBack: '<',
    serverId: '<',
    serviceName: '<',
  },
  controller,
  template,
};
