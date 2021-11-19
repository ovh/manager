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
      volumeId: /* @ngInject */ ($transition$) =>
        $transition$.params().volumeId,
      breadcrumb: () => null,
    },
  });
};
