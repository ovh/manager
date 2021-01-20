export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('storage', {
    url: '/storage',
    component: 'storage',
    resole: {
      nasha: /* @ngInject */ (StoragesService) =>
        StoragesService.getStorageNasha(),
      nas: /* @ngInject */ (StoragesService) => StoragesService.getStorageNas(),
      netapp: /* @ngInject */ (StoragesService) =>
        StoragesService.getStorageNetapp(),
      storages: /* @ngInject */ (nasha, nas, netapp) => [
        ...nasha,
        ...nas,
        ...netapp,
      ],
    },
  });
};
