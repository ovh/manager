import controller from './iplb-server-farm-add-update.controller';
import template from './iplb-server-farm-add-update.html';

export default {
  bindings: {
    farmId: '<',
    goBack: '<',
    goBackToEditPage: '<',
    goToServerFarmProbe: '<',
    serviceName: '<',
  },
  controller,
  template,
};
