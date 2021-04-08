import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ng-ui-router-breadcrumb';

import shelveInstance from '../instance/shelve/shelve.module';
import routing from './shelve.routing';

const moduleName = 'ovhManagerPciInstancesShelve';

angular
  .module(moduleName, [
    shelveInstance,
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
