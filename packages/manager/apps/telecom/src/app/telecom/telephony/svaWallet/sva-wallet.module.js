import angular from 'angular';

import kyc from './kyc';

import routing from './sva-wallet.routing';

const moduleName = 'ovhManagerTelecomTelephonySvaWallet';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate', kyc])
  .config(routing);

export default moduleName;
