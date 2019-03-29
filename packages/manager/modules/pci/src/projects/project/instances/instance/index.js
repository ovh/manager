import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';

import dashboard from './dashboard';
import routing from './instance.routing';

const moduleName = 'ovhManagerPciInstance';

angular
  .module(moduleName, [
    'ngOvhOtrs',
    'ui.router',
    dashboard,
  ])
  .config(routing);

export default moduleName;
