import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';

import routing from './nasha.routing';
import directoryModule from './directory';
import newModule from './new';
import onboardingModule from './onboarding';

const moduleName = 'ovhManagerNasha';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'ngUiRouterBreadcrumb',
    directoryModule,
    newModule,
    onboardingModule,
  ])
  .config(routing);

export default moduleName;
