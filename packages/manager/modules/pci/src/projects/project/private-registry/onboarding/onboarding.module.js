import angular from 'angular';
import '@uirouter/angularjs';
import credentials from './credentials';
import routing from './onboarding.routing';

import pciProjectPrivateRegistryOnboarding from './onboarding.component';

const moduleName = 'ovhManagerPciPrivateRegistryOnboardingLazyLoading';

angular
  .module(moduleName, ['ui.router', credentials])
  .config(routing)
  .component(
    'pciProjectPrivateRegistryOnboarding',
    pciProjectPrivateRegistryOnboarding,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
