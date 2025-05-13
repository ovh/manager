export const state = {
  abstract: true,
  name: 'app.dedicatedCloud.details.servicePackUpgrade',
  resolve: {
    goBack: /* @ngInject */ (goToPccDashboard) => goToPccDashboard,
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
