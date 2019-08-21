export const state = {
  name: 'app',
  redirectTo: 'support',
  url: '',
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  state,
  registerState,
};
