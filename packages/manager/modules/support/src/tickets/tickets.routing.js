import component from './tickets.component';

export const state = {
  name: 'support.tickets',
  params: {
    archived: {
      type: 'bool',
      squash: true,
      value: false,
    },
    filters: {
      array: true,
      type: 'json',
      value: [],
    },
    pageNumber: {
      squash: true,
      type: 'int',
      value: 1,
    },
    pageSize: {
      squash: true,
      type: 'int',
      value: 25,
    },
    sortBy: {
      squash: true,
      type: 'string',
      value: 'updateDate',
    },
    sortOrder: {
      squash: true,
      type: 'string',
      value: 'DESC',
    },
    tickets: {
      array: true,
      type: 'json',
      value: null,
    },
  },
  resolve: {
    archived: /* @ngInject */ ($transition$) => $transition$.params().archived,
    filters: /* @ngInject */ ($transition$) => $transition$.params().filters,
    goToTicket: /* @ngInject */ ($state) => (id) =>
      $state.go('support.tickets.ticket', { id }),
    goToTicketCreation: /* @ngInject */ ($state) => () =>
      $state.go('support.tickets.new'),
    gridColumnLastMessageFromTypeOptions: /* @ngInject */ (ticketsService) =>
      ticketsService.buildGridColumnLastMessageFromTypeOptions(),
    gridColumnStateTypeOptions: /* @ngInject */ (ticketsService) =>
      ticketsService.buildGridColumnStateTypeOptions(),
    onGridParamsChange: /* @ngInject */ ($state) => (params) =>
      $state.go('.', { ...$state.params, ...params }, { notify: false }),
    pageNumber: /* @ngInject */ ($transition$) =>
      $transition$.params().pageNumber,
    pageSize: /* @ngInject */ ($transition$) => $transition$.params().pageSize,
    reload: /* @ngInject */ ($state) => (params) =>
      $state.transitionTo(
        $state.current,
        { ...$state.params, ...params },
        { reload: true, inherit: false },
      ),
    sortBy: /* @ngInject */ ($transition$) => $transition$.params().sortBy,
    sortOrder: /* @ngInject */ ($transition$) =>
      $transition$.params().sortOrder,
    tickets: /* @ngInject */ ($transition$, ticketService) =>
      $transition$.params().tickets ||
      ticketService.query($transition$.params().archived),
    breadcrumb: () => null,
    hideBreadcrumb: () => true,
  },
  url: '/tickets?archived&filters&pageNumber&pageSize&sortBy&sortOrder',
  views: {
    'support@support': component.name,
  },
};

export default {
  state,
};
