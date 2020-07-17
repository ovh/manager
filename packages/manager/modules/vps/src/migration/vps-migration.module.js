import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import ovhManagerCore from '@ovh-ux/manager-core';

import migrationComponent from './vps-migration.component';
import migrationPlan from './components/plan';
import routing from './vps-migration.routing';
import service from './vps-migration.service';
import VpsService from '../import/vps.service';
import VpsTaskService from '../vps-task.service';

import './vps-migration.less';

const moduleName = 'ovhManagerVpsMigration';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
    'oui',
    migrationPlan,
    ovhManagerCore,
  ])
  .component('ovhManagerVpsMigration', migrationComponent)
  .service('VpsMigrationService', service)
  .service('VpsService', VpsService)
  .service('VpsTaskService', VpsTaskService)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
