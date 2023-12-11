import controller from './upgrade-server.controller';
import template from './upgrade-server.html';

export default {
  controller,
  template,
  bindings: {
    getOptionPrice: '<',
    getRenewDetails: '<',
    goBack: '<',
    optionId: '<',
    serverName: '<',
    upgradeMode: '<',
    upgradeOptions: '<',
    upgradeTask: '<',
    upgradeType: '<',
    renewPeriod: '<',
  },
};
