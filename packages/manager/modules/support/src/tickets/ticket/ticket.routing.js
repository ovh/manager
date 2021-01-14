import component from './ticket.component';
import { state as ticketsState } from '../tickets.routing';

export const state = {
  name: 'support.tickets.ticket',
  url: '/:id',
  params: {
    id: {
      type: 'int',
    },
  },
  resolve: {
    goBack: /* @ngInject */ ($state) => () => $state.go(ticketsState.name),
    reload: /* @ngInject */ ($state) => (params) =>
      $state.transitionTo(
        $state.current,
        { ...$state.params, ...params },
        { reload: true, inherit: false },
      ),
    ticketId: /* @ngInject */ ($transition$) => $transition$.params().id,
    ticket: /* @ngInject */ (
      $transition$,
      ticketMessageService,
      ticketService,
    ) => ticketService.getWithMessages($transition$.params().id),
    breadcrumb: /* @ngInject */ (ticketId) => ticketId,
  },
  views: {
    'support@support': component.name,
  },
};

export default {
  state,
};
