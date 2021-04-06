import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import component from './professional-use.component';

const moduleName = 'ovhManagerDedicatedServerDashboardProfessionalUse';

angular
  .module(moduleName, [
    ngAtInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedServerDashboardProfessionalUse', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
