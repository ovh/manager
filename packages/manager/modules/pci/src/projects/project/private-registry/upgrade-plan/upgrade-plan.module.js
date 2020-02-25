import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './upgrade-plan.component';
import planUpgrade from '../components/plan-upgrade';
import routing from './upgrade-plan.routing';

const moduleName = 'ovhManagerPciProjectPrivateRegistryUgradeplan';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate', planUpgrade])
  .config(routing)
  .component('pciProjectsPrivateRegistryUpgradePlan', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
