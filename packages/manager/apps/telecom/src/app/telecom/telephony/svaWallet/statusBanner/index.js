import angular from 'angular';

import component from './status-banner.component';

const moduleName = 'ovhManagerTelecomTelephonySvaWalletStatusBanner';

angular
  .module(moduleName, [])
  .component('telephonySvaWalletStatusBanner', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
