import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import terminate from './terminate';
import component from './service-status.component';

const moduleName = 'ovhManagerBmServerComponentsDashboardServiceStatus';

angular
  .module(moduleName, [
    ngAtInternet,
    'oui',
    'pascalprecht.translate',
    terminate,
  ])
  .component('serverServiceStatus', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
