import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import crud from '../crud/crud.module';
import routing from './duplicate.routing';

const moduleName = 'ovhManagerDbaasLogsDetailDashboardsDuplicate';

angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router', crud])
  .config(routing);

export default moduleName;
