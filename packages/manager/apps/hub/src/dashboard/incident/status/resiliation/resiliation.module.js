import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';

import component from './resiliation.component';
import routing from './routing';

const moduleName = 'ovhManagerHubIncidentStatusResiliation';

angular
  .module(moduleName, [
    ngOvhTranslateAsyncLoader,
    'oui',
    ngUiRouterLayout,
    'pascalprecht.translate',
    uiRouter,
  ])
  .component('hubIncidentStatusResiliation', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
