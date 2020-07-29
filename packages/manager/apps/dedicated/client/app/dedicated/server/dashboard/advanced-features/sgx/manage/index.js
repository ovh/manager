import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import confirmation from './confirmation';

import component from './manage.component';
import routing from './manage.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardSgxManage';

angular
  .module(moduleName, [
    confirmation,
    ngAtInternet,
    ngAtInternetUiRouterPlugin,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedServerDashboardSgxManage', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
