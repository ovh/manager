export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('vrack-home', {
      url: '/vrack',
      component: 'ovhManagerVrackComponent',
      translations: {
        value: ['.'],
        format: 'json',
      },
    })
    .state('vrack', {
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
