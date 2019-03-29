export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.blocks.block', {
      url: '/{storageId}',
      abtract: true,
      resolve: {
        storageId: /* @ngInject */$transition$ => $transition$.params().storageId,
      },
    });
};
