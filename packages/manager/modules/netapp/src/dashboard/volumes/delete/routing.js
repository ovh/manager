export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.delete', {
    url: '/delete?volumeId',
    views: {
      modal: {
        component: 'ovhManagerNetAppVolumesDelete',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToVolumes, trackClick) => {
        trackClick('delete::cancel');
        return goToVolumes;
      },
      volumeId: /* @ngInject */ ($transition$) =>
        $transition$.params().volumeId,
      breadcrumb: () => null,
    },
  });
};
