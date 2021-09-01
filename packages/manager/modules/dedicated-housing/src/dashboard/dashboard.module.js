import angular from 'angular';
import '@uirouter/angularjs';
import ngOvhAlerter from '@ovh-ux/ng-ovh-utils';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';

import routing from './dedicated-housing.routes';
import service from './dedicated-housing.service';
import pollingService from '../components/polling/polling.service';

import backup from '../backup/backup.module';
import task from '../task/task.module';

const moduleName = 'ovhManagerDedicatedHousingDashboard';

angular
  .module(moduleName, [
    backup,
    'oui',
    'ui.router',
    task,
    ngOvhAlerter,
    ngOvhUserPref,
  ])
  .config(routing)
  .service('Housing', service)
  .service('Polling', pollingService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
