import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './resume.component';
import routing from './resume.routing';

const moduleName = 'ovhManagerPciInstancesInstanceResume';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciInstancesInstanceResume', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
