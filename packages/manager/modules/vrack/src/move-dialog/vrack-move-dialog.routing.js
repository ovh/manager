export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack.move', {
    url: '/move',
    params: {
      goBack: null,
      service: null,
    },
    views: {
      modal: {
        component: 'ovhManagerVrackMoveDialogComponent',
      },
    },
    resolve: {
      goBack: /* @ngInject */ ($state, service) => (reload) =>
        $state.go('vrack.dashboard', { vrackId: service.vrack }, { reload }),
      service: /* @ngInject */ ($transition$) => $transition$.params().service,
    },
    layout: 'modal',
  });
};
