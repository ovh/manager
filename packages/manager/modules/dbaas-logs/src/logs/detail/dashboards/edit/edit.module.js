import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import crud from '../crud/crud.module';
import routing from './edit.routing';

const moduleName = 'ovhManagerDbaasLogsDetailDashboardsEdit';

angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router', crud])
  .config(routing);

export default moduleName;
