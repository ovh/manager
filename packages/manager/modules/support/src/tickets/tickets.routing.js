import component from './tickets.component';

import { STATE_NAME } from '../support.constants';

export const state = {
  name: `${STATE_NAME}.tickets`,
  resolve: {
    goToTicket: /* @ngInject */ $state => id => $state
      .go(`${STATE_NAME}.ticket`, { id }),
    gridColumnLastMessageFromTypeOptions: /* @ngInject */ ticketsService => ticketsService
      .buildGridColumnLastMessageFromTypeOptions(),
    gridColumnStateTypeOptions: /* @ngInject */ ticketsService => ticketsService
      .buildGridColumnStateTypeOptions(),
    tickets: /* @ngInject */ ticketService => ticketService
      .query(),
  },
  translations: { format: 'json', value: ['..', '.'] },
  url: '',
  views: {
    support: component.name,
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  registerState,
  state,
};
