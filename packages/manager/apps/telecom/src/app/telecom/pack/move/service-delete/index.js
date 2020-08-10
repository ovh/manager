import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import serviceDelete from './move-service-delete.component';

const moduleName = 'ovhManagerTelecomPackMoveSubservicesToDelete';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMoveServiceDelete', serviceDelete);

export default moduleName;
