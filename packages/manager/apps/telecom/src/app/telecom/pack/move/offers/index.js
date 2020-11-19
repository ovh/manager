import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import moveOffers from './move-offers.component';

import { PROMO_DISPLAY } from './move-offers.constant';

const moduleName = 'ovhManagerTelecomPackMoveOffers';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMoveOffers', moveOffers)
  .constant('PROMO_DISPLAY', PROMO_DISPLAY);

export default moduleName;
