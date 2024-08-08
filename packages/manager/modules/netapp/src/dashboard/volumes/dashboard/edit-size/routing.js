export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.dashboard.edit-size', {
    url: '/edit-size',
    views: {
      modal: {
        component: 'ovhManagerNetAppVolumesEditSizeComponent',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      volumeId: /* @ngInject */ ($transition$) =>
        $transition$.params().volumeId,
      volume: /* @ngInject */ (volumes, volumeId) =>
        volumes.find(({ id }) => id === volumeId),
      remainingQuota: /* @ngInject */ (totalVolumesStorage, storage) =>
        storage.quota - totalVolumesStorage,
      goBack: /* @ngInject */ (goToVolumeDetails, volume) => (message) => {
        goToVolumeDetails(volume, message);
      },
    },
  });
};
