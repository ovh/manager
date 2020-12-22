import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ovhManagerUpSellCrossSell from '@ovh-ux/manager-up-sell-cross-sell';

import component from './component';

const moduleName = 'ovhManagerDedicatedServerDashboardAdvices';

angular
  .module(moduleName, [
    atInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
    ovhManagerUpSellCrossSell,
  ])
  .component('dedicatedServerDashboardAdvices', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
