import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import add from '../add/add.module';
import routing from './edit.routing';

const moduleName = 'ovhManagerDbaasLogsDetailAliasesEdit';

angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router', add])
  .config(routing);

export default moduleName;
