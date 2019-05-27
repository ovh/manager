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
        fromState: null,
        confirmationRequired: null,
      },
      resolve: {
        goBack: /* @ngInject */  goBackToState => goBackToState,
        breadcrumb: /* @ngInject */ $translate => $translate.instant('private_registry_generate_credentials'),
        getRegistry: /* @ngInject */ (
          projectId,
          privateRegistryService,
          $stateParams,
        ) => privateRegistryService.getRegistry(projectId, $stateParams.registryId),
      },
    });
};
