import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import routing from './edit.routing';

const moduleName = 'ovhManagerPciProjectFailoverIpEdit';

angular
  .module(moduleName, [
    'ui.router',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
