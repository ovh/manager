import angular from 'angular';
import 'angular-translate';
import 'ovh-ui-angular';
import uiRouter from '@uirouter/angularjs';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ovhManagerHub from '@ovh-ux/manager-hub';

import component from './order-dashboard.component';

const moduleName = 'ovhManagerHubOrderDashboard';

angular
  .module(moduleName, [
    ngOvhTranslateAsyncLoader,
    'oui',
    ovhManagerHub,
    'pascalprecht.translate',
    uiRouter,
  ])
  .component('hubOrderDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
