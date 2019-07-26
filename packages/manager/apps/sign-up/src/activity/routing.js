export const state = {
  name: 'sign-up.activity',
  url: 'activity',
  views: {
    activity: {
      component: 'ovhSignUpActivity',
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
