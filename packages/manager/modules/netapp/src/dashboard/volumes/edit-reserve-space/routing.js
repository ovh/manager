export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.edit-reserve-space', {
    url: '/edit-reserve-space?volumeId',
    views: {
      modal: {
        component: 'ovhManagerNetAppVolumesEditReserveSpaceComponent',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      volumeId: /* @ngInject */ ($transition$) =>
        $transition$.params().volumeId,
      volume: /* @ngInject */ (volumes, volumeId) =>
        volumes.find(({ id }) => id === volumeId),
      goBack: /* @ngInject */ (goToVolumes) => (message) => {
        goToVolumes(message);
      },
    },
  });
};
