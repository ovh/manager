import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import routing from './task.routing';

const moduleName = 'ovhManagerEmailProDashboardTask';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing);

export default moduleName;
