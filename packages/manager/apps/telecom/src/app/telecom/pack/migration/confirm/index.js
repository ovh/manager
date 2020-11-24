import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import component from './pack-migration-confirm.component';

import { PROMO_DISPLAY } from './pack-migration-confirm.constant';

const moduleName = 'ovhManagerTelecomPackMigrationConfirm';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMigrationConfirm', component)
  .constant('PROMO_DISPLAY', PROMO_DISPLAY);

export default moduleName;
