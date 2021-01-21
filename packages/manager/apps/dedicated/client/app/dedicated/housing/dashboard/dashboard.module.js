import angular from 'angular';
import '@uirouter/angularjs';

import routing from './dedicated-housing.routes';
import service from './dedicated-housing.service';

import backup from '../backup/backup.module';
import task from '../task/task.module';

const moduleName = 'ovhManagerDedicatedHousingDashboard';

angular
  .module(moduleName, [backup, 'oui', 'ui.router', task])
  .config(routing)
  .service('Housing', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
