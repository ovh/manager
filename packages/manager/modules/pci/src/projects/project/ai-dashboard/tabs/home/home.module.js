import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './home.component';
import routing from './home.routing';

const moduleName = 'ovhManagerPciAIDashboardHome';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectAIDashboardHome', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
