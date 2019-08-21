import component from './tickets.component';

export const state = {
  name: 'support.tickets',
  params: {
    cleanCache: {
      squash: true,
      type: 'bool',
      value: false,
    },
  },
  resolve: {
    goToTicket: /* @ngInject */ $state => id => $state
      .go('support.tickets.ticket', { id }),
    gridColumnLastMessageFromTypeOptions: /* @ngInject */ ticketsService => ticketsService
      .buildGridColumnLastMessageFromTypeOptions(),
    gridColumnStateTypeOptions: /* @ngInject */ ticketsService => ticketsService
      .buildGridColumnStateTypeOptions(),
    reload: /* @ngInject */ $state => params => $state
      .transitionTo(
        $state.current,
        { ...$state.params, ...params },
        { reload: true, inherit: false },
      ),
    tickets: /* @ngInject */ ($transition$, ticketService) => ticketService
      .query($transition$.params().cleanCache),
  },
  url: '/tickets',
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
