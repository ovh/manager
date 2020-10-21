import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import component from './pack-migration-shipping.component';

const moduleName = 'ovhManagerTelecomPackMigrationShipping';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMigrationShipping', component);

export default moduleName;
