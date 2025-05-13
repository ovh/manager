import angular from 'angular';
import angularTranslate from 'angular-translate';
import atInternet from '@ovh-ux/ng-at-internet';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './autorenew-blocked.component';
import routing from './autorenew-blocked.routing';

const moduleName = 'ovhManagerBillingAutorenewBlocked';

angular
  .module(moduleName, [
    angularTranslate,
    atInternet,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('billingAutorenewBlocked', component);

export default moduleName;
