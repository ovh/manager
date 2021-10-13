import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';

import atInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import routing from './cdn-flush.routing';
import component from './cdn-flush.component';

const moduleName = 'ovhManagerHostingMultisiteCdnFlush';

angular
  .module(moduleName, [
    atInternet,
    ngAtInternetUiRouterPlugin,
    ngTranslateAsyncLoader,
    uiRouter,
  ])
  .component('hostingCdnFlushComponent', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
