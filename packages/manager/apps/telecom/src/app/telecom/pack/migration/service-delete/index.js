import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import component from './pack-migration-service-delete.component';

const moduleName = 'ovhManagerTelecomPackMigrationServiceDelete';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMigrationServiceDelete', component);

export default moduleName;
