import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import component from './technical-details.component';

const moduleName = 'ovhManagerDedicatedServerDashboardTechnicalDetails';

angular
  .module(moduleName, [
    ngAtInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedServerDashboardTechnicalDetails', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
