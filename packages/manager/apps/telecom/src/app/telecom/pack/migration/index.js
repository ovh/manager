import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import component from './pack-migration.component';
import routing from './pack-migration.routing';

import buildingDetails from './building-details';
import confirm from './confirm';
import migration from './migration';
import offers from './offers';
import serviceDelete from './service-delete';
import shipping from './shipping';

const moduleName = 'ovhManagerTelecomPackMigration';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    buildingDetails,
    confirm,
    migration,
    offers,
    serviceDelete,
    shipping,
  ])
  .component('packMigration', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
