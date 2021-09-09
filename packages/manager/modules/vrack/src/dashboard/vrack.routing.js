export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack.dashboard', {
    url: '/:vrackId',
    component: 'ovhManagerVrackComponent',
    resolve: {
      goToMoveDialog: /* @ngInject */ ($state) => (service) =>
        $state.go('vrack.dashboard.move', { service }),
      vrackId: /* @ngInject */ ($transition$) => $transition$.params().vrackId,
      breadcrumb: /* @ngInject */ (vrackId) => vrackId,
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
