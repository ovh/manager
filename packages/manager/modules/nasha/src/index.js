import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-ui-router-breadcrumb';

import { NASHA_TASK } from './nasha.constants';

import routing from './nasha.routing';

import directoryModule from './directory';
import newModule from './new';
import onboardingModule from './onboarding';
import dashboardModule from './dashboard';
import partitionModule from './partition';

const moduleName = 'ovhManagerNasha';

angular
  .module(moduleName, [
    'ui.router',
    'ngUiRouterBreadcrumb',
    directoryModule,
    newModule,
    onboardingModule,
    dashboardModule,
    partitionModule,
  ])
  .config(routing)
  .constant('NashaTask', NASHA_TASK)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
