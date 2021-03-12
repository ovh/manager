import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import component from './migration.component';
import routing from './routing';

import contractsModule from './contracts';
import migrationWarning from './migration-warning';

const moduleName = 'ovhManagerHubIncidentMigration';

angular
  .module(moduleName, [
    contractsModule,
    migrationWarning,
    ngOvhTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    uiRouter,
  ])
  .component('hubIncidentMigration', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
