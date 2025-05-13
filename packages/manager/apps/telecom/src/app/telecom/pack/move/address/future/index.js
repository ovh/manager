import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import addressFuture from './move-address-future.component';

const moduleName = 'ovhManagerTelecomPackMoveAddressFuture';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMoveAddressFuture', addressFuture);

export default moduleName;
