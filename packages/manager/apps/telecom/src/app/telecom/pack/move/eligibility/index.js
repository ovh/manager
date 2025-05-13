import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import eligibility from './move-eligibility.component';

import eligibilityAddress from './address';
import eligibilityLineNumber from './lineNumber';

const moduleName = 'ovhManagerTelecomPackMoveEligibility';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    eligibilityAddress,
    eligibilityLineNumber,
  ])
  .component('packMoveEligibility', eligibility);

export default moduleName;
