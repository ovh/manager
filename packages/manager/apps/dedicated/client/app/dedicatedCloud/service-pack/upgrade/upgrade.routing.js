export const state = {
  abstract: true,
  name: 'app.dedicatedClouds.servicePackUpgrade',
  resolve: {
    currentService: /* @ngInject */ ($transition$, DedicatedCloud) =>
      $transition$.params().currentService ||
      DedicatedCloud.getSelected($transition$.params().productId, true),

    isDowngrade: /* @ngInject */ (currentService) =>
      currentService.servicePackName === 'nsx-and-vrops',

    goBack: /* @ngInject */ ($state) => () => $state.go('app.dedicatedClouds'),
  },
  translations: {
    format: 'json',
    value: ['.'],
  },
  url: '/servicePackUpgrade',
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  registerState,
  state,
};
