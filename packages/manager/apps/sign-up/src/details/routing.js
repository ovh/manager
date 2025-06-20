import { INDIAN_SUBSIDIARY } from '../constants';

export const state = {
  name: 'sign-up.details',
  url: 'details',
  views: {
    details: {
      component: 'ovhSignUpDetails',
    },
  },
  resolve: {
    trackField: /* @ngInject */ (atInternet) => (field, value) => {
      atInternet.trackClick({
        type: 'action',
        name: `accountcreation::${field}::${value}`,
      });
    },
    isIndianSubsidiary: /* @ngInject */ (subsidiary) =>
      subsidiary === INDIAN_SUBSIDIARY,
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
