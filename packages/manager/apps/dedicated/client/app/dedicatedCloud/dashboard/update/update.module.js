import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './update.component';
import routing from './update.routing';

const moduleName = 'ovhManagerPccDashboardUpdate';

angular
  .module(moduleName, [
    ngAtInternet,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('ovhManagerPccDashboardUpdate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
