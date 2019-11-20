import angular from 'angular';

import component from './packs.component';
import routing from './packs.routing';

const moduleName = 'ovhManagerTelecomPackInternetAccessPacks';

angular
  .module(moduleName, [])
  .component('telecomPackInternetAccessPacks', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
