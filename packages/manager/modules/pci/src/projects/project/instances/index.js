import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import component from './instances.component';
import routing from './instances.routing';

const moduleName = 'ovhManagerPciInstances';

console.log('instances');
angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectInstances', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
