import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './stop-app.component';
import routing from './stop-app.routing';

const moduleName = 'ovhManagerPciAppsAppDashboardAppStop';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciAppsAppDashboardAppStop', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
