import component from './tickets.component';

export const state = {
  name: 'support.tickets',
  params: {
    tickets: {
      type: 'json',
      value: null,
    },
  },
  resolve: {
    goToTicket: /* @ngInject */ $state => (ticket, tickets) => $state
      .go('support.ticket', { ticketId: ticket.ticketId, ticket, tickets }),
    gridColumnLastMessageFromTypeOptions: /* @ngInject */ ticketsService => ticketsService
      .buildGridColumnLastMessageFromTypeOptions(),
    gridColumnStateTypeOptions: /* @ngInject */ ticketsService => ticketsService
      .buildGridColumnStateTypeOptions(),
    tickets: /* @ngInject */ ($transition$, ticketsService) => ticketsService
      .extractOrFetchTicketsForGrid($transition$.params()),
    translateTicketSender: /* @ngInject */ supportService => ticketSender => supportService
      .translateTicketSender(ticketSender),
    translateTicketState: /* @ngInject */ supportService => ticketState => supportService
      .translateTicketState(ticketState),
  },
  translations: {
    format: 'json',
    value: [
      '..',
      '.',
    ],
  },
  url: '',
  views: {
    'support@support': component.name,
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  registerState,
  state,
};
