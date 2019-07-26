export const state = {
  name: 'sign-up.details',
  url: 'details',
  views: {
    details: {
      component: 'ovhSignUpDetails',
    },
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  registerState,
  state,
};
