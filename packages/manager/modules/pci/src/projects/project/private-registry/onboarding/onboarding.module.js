import angular from 'angular';
import '@uirouter/angularjs';
import create from './create';
import credentials from './credentials';

import pciProjectPrivateRegistryOnboarding from './onboarding.component';

const moduleName = 'ovhManagerPciPrivateRegistryOnboardingLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    create,
    credentials,
  ])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.private-registry.onboarding', {
        url: '/onboarding',
        component: 'pciProjectPrivateRegistryOnboarding',
        params: {
          registryId: null,
        },
        resolve: {
          breadcrumb: () => null, // Hide breadcrumb
        },
      });
  })
  .component('pciProjectPrivateRegistryOnboarding', pciProjectPrivateRegistryOnboarding);

export default moduleName;
