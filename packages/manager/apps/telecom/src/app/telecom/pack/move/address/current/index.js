import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import addressCurrent from './move-address-current.component';

const moduleName = 'ovhManagerTelecomPackMoveAddressCurrent';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMoveAddressCurrent', addressCurrent);

export default moduleName;
