import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ng-ui-router-breadcrumb';

import stopInstance from '../instance/stop/stop.module';
import routing from './stop.routing';

const moduleName = 'ovhManagerPciInstancesStop';

angular
  .module(moduleName, [
    stopInstance,
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
