import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ovhManagerHub from '@ovh-ux/manager-hub';

import component from './order-dashboard.component';
import welcome from '../welcome';

const moduleName = 'ovhManagerHubOrderDashboard';

angular
  .module(moduleName, [
    ngOvhTranslateAsyncLoader,
    'oui',
    ovhManagerHub,
    'pascalprecht.translate',
    uiRouter,
    welcome,
  ])
  .component('hubOrderDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
