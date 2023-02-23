import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './create-user.component';
import routing from './create-user.routing';

const moduleName = 'ovhManagerPciAiDashboardUsersTokensCreateUser';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('pciProjectAiDashboardCreateUserModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
