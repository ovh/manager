import angular from 'angular';
import '@uirouter/angularjs';

import component from './onboarding.component';

const moduleName = 'ovhManagerPciPrivateRegistryOnboardingLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
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
        translations: {
          value: [
            './..',
            '.',
          ],
          format: 'json',
        },
      })
      .state('pci.projects.project.private-registry.onboarding.create', {
        url: '/create?fromState',
        views: {
          modal: {
            component: 'pciProjectPrivateRegistryCreateComponent',
          },
        },
        layout: 'modal',
        backdrop: 'static',
        resolve: {
          goBack: /* @ngInject */  goBackToState => goBackToState,
        },
      })
      .state('pci.projects.project.private-registry.onboarding.credentials', {
        url: '/credentials?registryId',
        component: 'credentialsComponent',
        layout: 'modal',
        params: {
          registryId: null,
          registryName: null,
          harborURL: null,
          fromState: null,
          confirmationRequired: null,
        },
        resolve: {
          goBack: /* @ngInject */  goBackToState => goBackToState,
          breadcrumb: /* @ngInject */ $translate => $translate
            .refresh()
            .then(() => $translate.instant('private_registry_generate_credentials')),
        },
      });
  })
  .component('pciProjectPrivateRegistryOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
