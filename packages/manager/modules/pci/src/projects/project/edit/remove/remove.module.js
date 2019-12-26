import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import component from './remove.component';
import routing from './remove.routing';

const moduleName = 'ovhManagerPciProjectEditRemove';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate'])
  .component('pciProjectEditRemove', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
