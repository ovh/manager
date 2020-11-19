import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import component from './pack-migration-offers.component';

import { PROMO_DISPLAY } from './pack-migration-offers.constant';

const moduleName = 'ovhManagerTelecomPackMigrationOffers';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMigrationOffers', component)
  .constant('PROMO_DISPLAY', PROMO_DISPLAY);

export default moduleName;
