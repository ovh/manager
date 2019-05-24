export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.private-registry.api-url', {
      url: '/api-url?registryId',
      params: {
        url: null,
      },
      views: {
        modal: {
          component: 'pciPrivateRegistryApiUrl',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: /* @ngInject */ $translate => $translate.instant('private_registry_copy_api'),
      },
    });
};
