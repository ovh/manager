import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import instance from './instance';

import component from './instances.component';
import routing from './instances.routing';

const moduleName = 'ovhManagerPciInstances';

angular
  .module(moduleName, [
    instance,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectInstances', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
