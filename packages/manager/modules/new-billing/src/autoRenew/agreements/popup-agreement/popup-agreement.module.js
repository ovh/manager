import angular from 'angular';
import angularTranslate from 'angular-translate';
import atInternet from '@ovh-ux/ng-at-internet';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './popup-agreement.component';
import routing from './popup-agreement.routes';

const moduleName = 'ovhManagerBillingAutorenewPopupAgreement';

angular
  .module(moduleName, [
    angularTranslate,
    atInternet,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('billingAutorenewPopupAgreement', component);

export default moduleName;
