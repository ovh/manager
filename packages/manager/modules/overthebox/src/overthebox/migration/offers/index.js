import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import offers from './overTheBox-migration-offers.component';
import service from './overTheBox-migration-offers.service';

const moduleName = 'ovhManagerOtbMigrationOffers';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('overtheboxMigrationOffers', offers)
  .service('OverTheBoxMigrationService', service);

export default moduleName;
