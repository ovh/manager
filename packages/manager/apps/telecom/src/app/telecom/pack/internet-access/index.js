import angular from 'angular';

import packs from './packs';

import component from './internet-access.component';
import routing from './internet-access.routing';

const moduleName = 'ovhManagerTelecomPackInternetAccess';

angular
  .module(moduleName, [
    packs,
  ])
  .component('telecomPackInternetAccess', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
