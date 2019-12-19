export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.private-registry.credentials', {
      url: '/:registryId/credentials',
      layout: 'modal',
      views: {
        modal: {
          component: 'pciPrivateRegistryCredentials',
        },
      },
      resolve: {
        confirmationRequired: () => true,
        goBack: /* @ngInject */  (goBackToList) => goBackToList,
        goToList: /* @ngInject */  (goBackToList) => goBackToList,
        registry: /* @ngInject */ (
          projectId,
          pciPrivateRegistryService,
          $stateParams,
        ) => pciPrivateRegistryService.getRegistry(projectId, $stateParams.registryId),
        breadcrumb: /* @ngInject */ ($translate) => $translate.instant('private_registry_generate_credentials'),
      },
    });
};
