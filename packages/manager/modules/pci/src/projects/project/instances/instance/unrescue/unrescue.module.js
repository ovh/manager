import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './unrescue.component';
import routing from './unrescue.routing';

const moduleName = 'ovhManagerPciInstancesInstanceUnrescue';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciInstancesInstanceUnrescue', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
