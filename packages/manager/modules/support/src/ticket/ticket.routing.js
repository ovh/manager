import component from './ticket.component';
import TicketService from './ticket.service';

export const state = {
  name: 'support.ticket',
  params: {
    messages: {
      type: 'json',
      value: null,
    },
    ticket: {
      type: 'json',
      value: null,
    },
    ticketId: {
      type: 'int',
    },
    tickets: {
      type: 'json',
      value: null,
    },
  },
  resolve: {
    goToTickets: /* @ngInject */ $state => tickets => $state
      .go('support.tickets', { tickets }),
    isMessageFromCustomer: () => sender => TicketService
      .isMessageFromCustomer(sender),
    messages: /* @ngInject */ ($transition$, ticketService) => ticketService
      .fetchMessages($transition$.params()),
    ticket: /* @ngInject */ ($transition$, ticketService) => ticketService
      .fetchTicket($transition$.params()),
    tickets: /* @ngInject */ $transition$ => $transition$
      .params().tickets,
    translateTicketSender: /* @ngInject */ supportService => ticketSender => supportService
      .translateTicketSender(ticketSender),
    translateTicketState: /* @ngInject */ supportService => ticketState => supportService
      .translateTicketState(ticketState),
  },
  translations: {
    format: 'json',
    value: ['.'],
  },
  url: '/ticket/:ticketId',
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
