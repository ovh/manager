export const state = {
  name: 'sign-up.details',
  url: 'details',
  views: {
    details: {
      component: 'ovhSignUpDetails',
    },
  },
  resolve: {
    onFieldError: /* @ngInject */ (trackError) => (field) =>
      trackError('step2', field),
  },
  atInternet: {
    rename: 'accountcreation-step2',
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  registerState,
  state,
};
