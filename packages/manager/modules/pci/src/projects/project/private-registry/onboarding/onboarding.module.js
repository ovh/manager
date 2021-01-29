import angular from 'angular';
import '@uirouter/angularjs';
import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import credentials from './credentials';
import routing from './onboarding.routing';

import pciProjectPrivateRegistryOnboarding from './onboarding.component';

const moduleName = 'ovhManagerPciPrivateRegistryOnboardingLazyLoading';

angular
  .module(moduleName, ['ui.router', credentials, OnboardingLayoutHelper])
  .config(routing)
  .component(
    'pciProjectPrivateRegistryOnboarding',
    pciProjectPrivateRegistryOnboarding,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
