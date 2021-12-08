import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import atInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';

import component from './hosting-cdn-cancel-terminate.component';
import routing from './hosting-cdn-cancel-terminate.routing';

const moduleName = 'ovhManagerHostingCdnTerminate';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    atInternet,
    ngAtInternetUiRouterPlugin,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('hostingCdnCancelTerminate', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
