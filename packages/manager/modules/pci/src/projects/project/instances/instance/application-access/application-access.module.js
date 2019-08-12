import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './application-access.component';
import routing from './application-access.routing';

const moduleName = 'ovhManagerPciInstancesInstanceApplicationAccess';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciInstancesInstanceApplicationAccess', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
