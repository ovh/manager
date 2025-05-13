import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ng-ui-router-breadcrumb';

import startInstance from '../instance/start/start.module';
import routing from './start.routing';

const moduleName = 'ovhManagerPciInstancesStart';

angular
  .module(moduleName, [
    startInstance,
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngUiRouterLayout',
    'ngUiRouterBreadcrumb',
  ])
  .config(routing);

export default moduleName;
