import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './terminate.component';
import routing from './terminate.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardTerminate';

angular
  .module(moduleName, [
    atInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedServerDashboardTerminate', component)
  .config(routing)
  // TODO: inject own translations
  .run(/* @ngTranslationsInject:json ../details/translations */)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
