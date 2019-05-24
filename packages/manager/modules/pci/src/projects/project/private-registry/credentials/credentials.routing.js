export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.private-registry.onboarding.credentials', {
      url: '/credentials?registryId',
      layout: 'modal',
      params: {
        registryId: null,
        registryName: null,
        harborURL: null,
        fromState: null,
        confirmationRequired: null,
      },
      views: {
        modal: {
          component: 'pciPrivateRegistryCredentials',
        },
      },
      resolve: {
        goBack: /* @ngInject */  goBackToState => goBackToState,
        breadcrumb: /* @ngInject */ $translate => $translate.instant('private_registry_generate_credentials'),
      },
    })
    .state('pci.projects.project.private-registry.credentials', {
      url: '/credentials?registryId',
      layout: 'modal',
      views: {
        modal: {
          component: 'pciPrivateRegistryCredentials',
        },
      },
      params: {
        registryId: null,
        registryName: null,
        harborURL: null,
        fromState: null,
        confirmationRequired: null,
      },
      resolve: {
        goBack: /* @ngInject */  goBackToState => goBackToState,
        breadcrumb: /* @ngInject */ $translate => $translate.instant('private_registry_generate_credentials'),
      },
    });
};
