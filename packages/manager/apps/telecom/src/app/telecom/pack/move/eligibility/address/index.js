import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import eligibilityAddress from './move-eligibility-address.component';

const moduleName = 'ovhManagerTelecomPackMoveEligibilityAddress';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    'oui',
  ])
  .component('packMoveEligibilityAddress', eligibilityAddress);

export default moduleName;
