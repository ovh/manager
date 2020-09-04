export const state = {
  name: 'sign-up.activity',
  url: 'activity',
  views: {
    activity: {
      component: 'ovhSignUpActivity',
    },
  },
  resolve: {
    onFieldError: /* @ngInject */ (trackError) => (field) =>
      trackError('step3', field),
  },
  atInternet: {
    rename: /* @ngInject */ ($state) => {
      const me = $state.transition.injector().get('me');
      return `accountcreation-step3-${me.model.legalform}`;
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
