import angular from 'angular';

import component from './profile-tile.component';

const moduleName = 'ovhManagerTelecomTelephonySvaWalletProfileTile';

angular
  .module(moduleName, [])
  .component('telephonySvaWalletProfileTile', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
