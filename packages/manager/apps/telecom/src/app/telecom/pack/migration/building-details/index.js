import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import component from './migration-building-details.component';

const moduleName = 'ovhManagerTelecomPackMigrationBuildingDetails';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMigrationBuildingDetails', component);

export default moduleName;
