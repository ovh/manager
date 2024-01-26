import angular from 'angular';
import '@ovh-ux/ng-at-internet';
import 'angular-translate';

import component from './project-dashboard-activate-banner.component';

const moduleName = 'ovhManagerPciProjectDashboardActivateBanner';
angular
  .module(moduleName, ['ngAtInternet', 'pascalprecht.translate'])
  .component('pciProjectDashboardActivateBanner', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
