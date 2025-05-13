import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import unbundling from './move-unbundling.component';

const moduleName = 'ovhManagerTelecomPackMoveUnbundling';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMoveUnbundling', unbundling);

export default moduleName;
