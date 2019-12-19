import component from './ticket.component';
import { state as ticketsState } from '../tickets.routing';

export const state = {
  name: 'support.tickets.ticket',
  params: {
    id: {
      type: 'int',
    },
  },
  resolve: {
    goBack: /* @ngInject */ ($state) => () => $state
      .go(ticketsState.name),
    reload: /* @ngInject */ ($state) => (params) => $state
      .transitionTo(
        $state.current,
        { ...$state.params, ...params },
        { reload: true, inherit: false },
      ),
    ticket: /* @ngInject */ ($transition$, ticketMessageService, ticketService) => ticketService
      .getWithMessages($transition$.params().id),
  },
  url: '/:id',
  views: {
    'support@support': component.name,
  },
};

export default {
  state,
};
