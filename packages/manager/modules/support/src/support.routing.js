import component from './support.component';

import { state as stateToTickets } from './tickets/tickets.routing';

import { STATE_NAME } from './support.constants';

export const state = {
  name: STATE_NAME,
  redirectTo: stateToTickets.name,
  translations: { format: 'json', value: ['.'] },
  url: '/support',
  views: {
    '@app.account': component.name,
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  registerState,
  state,
};
