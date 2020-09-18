export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack', {
    url: '/vrack/:vrackId',
    component: 'ovhManagerVrackComponent',
    resolve: {
      goToMoveDialog: /* @ngInject */ ($state) => (service) =>
        $state.go('vrack.move', { service }),
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
