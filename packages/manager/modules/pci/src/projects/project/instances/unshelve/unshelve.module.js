import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ng-ui-router-breadcrumb';

import unshelveInstance from '../instance/unshelve/unshelve.module';
import routing from './unshelve.routing';

const moduleName = 'ovhManagerPciInstancesUnshelve';

angular
  .module(moduleName, [
    unshelveInstance,
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
