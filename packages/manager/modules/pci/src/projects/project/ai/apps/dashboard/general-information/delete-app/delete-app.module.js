import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './delete-app.component';
import routing from './delete-app.routing';

const moduleName = 'ovhManagerPciAppsAppDashboardAppDelete';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciAppsAppDashboardAppDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
