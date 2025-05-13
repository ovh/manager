import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './associate-vrack.component';
import routing from './associate-vrack.routing';

const moduleName = 'ovhCloudConnectDetailsAssociateVrack';

angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router'])
  .config(routing)
  .component('cloudConnectDetailsAssociateVrack', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
