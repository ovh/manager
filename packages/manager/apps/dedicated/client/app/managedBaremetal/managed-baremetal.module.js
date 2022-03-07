import angular from 'angular';
import '@uirouter/angularjs';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import routing from './managed-baremetal.routing';
import onboarding from './onboarding';

const moduleName = 'ovhManagerManagedBaremetal';

angular
  .module(moduleName, ['ui.router', ListLayoutHelper.moduleName, onboarding])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
