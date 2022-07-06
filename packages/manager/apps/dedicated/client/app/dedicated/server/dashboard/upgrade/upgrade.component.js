import controller from './upgrade.controller';
import template from './upgrade.html';

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
  },
};
