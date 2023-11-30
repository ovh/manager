import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';
import service from './service';

const moduleName = 'ovhManagerNetAppNetworkDeleteModule';

angular
  .module(moduleName, ['ovhManagerCore', 'pascalprecht.translate', 'ui.router'])
  .config(routing)
  .component('ovhManagerNetAppNetworkDelete', component)
  .service('NetappNetworkDeleteService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
