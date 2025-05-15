export const state = {
  name: 'sign-up.identity',
  url: 'identity',
  views: {
    identity: {
      component: 'ovhSignUpIdentity',
    },
  },
  resolve: {
    onFieldError: /* @ngInject */ (trackError) => (field) =>
      trackError('step1', field),
    trackField: /* @ngInject */ (atInternet) => (field, value) => {
      atInternet.trackClick({
        type: 'action',
        name: `accountcreation::${field}::${value}`,
      });
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
