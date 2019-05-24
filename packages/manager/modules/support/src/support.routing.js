import component from './support.component';

export const state = {
  name: 'support',
  translations: {
    format: 'json',
    value: [
      '.',
    ],
  },
  url: '/support',
  views: {
    'app@': component.name,
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  registerState,
  state,
};
