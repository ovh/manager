import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import summary from './summary.component';

const moduleName = 'ovhManagerTelecomTelephonyLinePhoneOrderSummary';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    'oui',
  ])
  .component('phoneSummary', summary);

export default moduleName;
