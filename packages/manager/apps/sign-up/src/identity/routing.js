export const state = {
  name: 'sign-up.identity',
  url: 'identity',
  views: {
    identity: {
      component: 'ovhSignUpIdentity',
    },
  },
  atInternet: {
    ignore: true,
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  registerState,
  state,
};
