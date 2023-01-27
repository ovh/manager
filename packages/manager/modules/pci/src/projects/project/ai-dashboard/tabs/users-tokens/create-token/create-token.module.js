import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './create-token.component';
import routing from './create-token.routing';

const moduleName = 'ovhManagerPciAiDashboardUsersTokensCreateToken';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('pciProjectAiDashboardCreateTokenModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
