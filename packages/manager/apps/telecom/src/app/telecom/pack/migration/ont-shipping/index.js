import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import component from './pack-migration-ont-shipping.component';
import service from './pack-migration-ont-shipping.service';

const moduleName = 'ovhManagerTelecomPackMigrationOntShipping';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMigrationOntShipping', component)
  .service('PackMigrationOntShippingService', service);

export default moduleName;
