import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ovhManagerHub from '@ovh-ux/manager-hub';

import component from './order-dashboard.component';

const moduleName = 'ovhManagerHubDashboardWelcome';

angular
  .module(moduleName, [
    ngOvhTranslateAsyncLoader,
    'oui',
    ovhManagerHub,
    'pascalprecht.translate',
  ])
  .component('hubDashboardWelcome', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
