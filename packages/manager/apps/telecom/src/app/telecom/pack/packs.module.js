import angular from 'angular';

import component from './packs.component';
import routing from './packs.routing';

import dashboard from './dashboard/pack.module';

const moduleName = 'ovhManagerTelecomPackInternetAccessPacks';

angular
  .module(moduleName, [dashboard])
  .component('telecomPackInternetAccessPacks', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
