import angular from 'angular';

import kycIdentityForm from './kycIdentityForm';

import routing from './sva-wallet.routing';

const moduleName = 'ovhManagerTelecomTelephonySvaWallet';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate', kycIdentityForm])
  .config(routing);

export default moduleName;
