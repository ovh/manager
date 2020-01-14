import controller from './iplb-server-farm.controller';
import template from './iplb-server-farm.html';

export default {
  bindings: {
    goToServerAdd: '<',
    goToServerDelete: '<',
    goToServerPreview: '<',
    goToServerStatus: '<',
    goToServerUpdate: '<',
    goToIplbServerFarm: '<',
    goToIplbServerFarmDelete: '<',
    goToIplbServerFarmPreview: '<',
    goToIplbServerFarmUpdate: '<',
    serviceName: '<',
  },
  controller,
  template,
};
