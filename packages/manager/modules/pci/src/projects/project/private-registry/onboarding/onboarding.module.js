import angular from 'angular';
import '@uirouter/angularjs';
import create from './create';
import credentials from './credentials';
import routing from './onboarding.routing';

import pciProjectPrivateRegistryOnboarding from './onboarding.component';

const moduleName = 'ovhManagerPciPrivateRegistryOnboardingLazyLoading';

angular
  .module(moduleName, ['ui.router', create, credentials])
  .config(routing)
  .component(
    'pciProjectPrivateRegistryOnboarding',
    pciProjectPrivateRegistryOnboarding,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
