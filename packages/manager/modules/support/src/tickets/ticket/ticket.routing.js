import component from './ticket.component';
import { state as ticketsState } from '../tickets.routing';

export const state = {
  name: 'support.tickets.ticket',
  params: {
    cleanCache: {
      squash: true,
      type: 'bool',
      value: false,
    },
    id: {
      type: 'int',
    },
  },
  resolve: {
    cleanCache: /* @ngInject */ $transition$ => $transition$
      .params().cleanCache,
    goBack: /* @ngInject */ $state => cleanCache => $state
      .go(ticketsState.name, { cleanCache }),
    reload: /* @ngInject */ $state => params => $state
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
