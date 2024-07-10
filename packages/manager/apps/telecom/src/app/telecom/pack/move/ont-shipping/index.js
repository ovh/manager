import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import ontShipping from './move-ont-shipping.component';
import service from './move-ont-shipping.service';

const moduleName = 'ovhManagerTelecomPackMoveOntShipping';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMoveOntShipping', ontShipping)
  .service('MoveOntShippingService', service);

export default moduleName;
