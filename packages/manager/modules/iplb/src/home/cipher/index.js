import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-cipher-change.routing';
import cipherComponent from './iplb-cipher-change.component';

const moduleName = 'ovhManagerIplbCipherChangeModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbCipherChange', cipherComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
