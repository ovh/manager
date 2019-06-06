export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.private-registry.credentials', {
      url: '/credentials',
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
        confirmationRequired: null,
      },
      resolve: {
        goBack: /* @ngInject */  goBackToList => goBackToList,
        goToList: /* @ngInject */  goBackToList => goBackToList,
        breadcrumb: /* @ngInject */ $translate => $translate.instant('private_registry_generate_credentials'),
        getRegistry: /* @ngInject */ (
          projectId,
          pciPrivateRegistryService,
          $stateParams,
        ) => pciPrivateRegistryService.getRegistry(projectId, $stateParams.registryId),
      },
    });
};
