import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

import component from './modems-delete.component';
import routing from './modems-delete.routing';

const moduleName = 'ovhManagerTelecomSpareModemsDelete';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('deleteModemsSpare', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
