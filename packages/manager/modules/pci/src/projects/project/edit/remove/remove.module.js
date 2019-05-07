import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import routing from './remove.routing';

const moduleName = 'ovhManagerPciProjectEditRemove';

angular
  .module(moduleName, [
    'ui.router',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
