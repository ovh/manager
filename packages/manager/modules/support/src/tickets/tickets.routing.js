import get from 'lodash/get';

import component from './tickets.component';

export const state = {
  name: 'support.tickets',
  params: {
    filters: {
      array: true,
      squash: true,
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
  },
  resolve: {
    filters: /* @ngInject */ $transition$ => $transition$
      .params().filters,
    goToTicket: /* @ngInject */ $state => id => $state
      .go('support.tickets.ticket', { id }),
    goToTicketCreation: /* @ngInject */ $state => () => $state
      .go('support.new'),
    gridColumnLastMessageFromTypeOptions: /* @ngInject */ ticketsService => ticketsService
      .buildGridColumnLastMessageFromTypeOptions(),
    gridColumnStateTypeOptions: /* @ngInject */ ticketsService => ticketsService
      .buildGridColumnStateTypeOptions(),
    onGridParamsChange: /* @ngInject */ $state => params => $state
      .go(
        '.',
        { ...$state.params, ...params },
        { notify: false },
      ),
    pageNumber: /* @ngInject */ tickets => parseInt(
      get(tickets.headers, 'x-pagination-number'),
      10,
    ),
    pageSize: /* @ngInject */ tickets => parseInt(
      get(tickets.headers, 'x-pagination-size'),
      10,
    ),
    totalNumberOfItems: /* @ngInject */ tickets => parseInt(
      get(tickets.headers, 'x-pagination-elements'),
      10,
    ),
    sortBy: /* @ngInject */ tickets => tickets
      .headers['x-pagination-sort'],
    sortOrder: /* @ngInject */ tickets => tickets
      .headers['x-pagination-sort-order'],
    reload: /* @ngInject */ $state => params => $state
      .transitionTo(
        $state.current,
        { ...$state.params, ...params },
        { reload: true, inherit: false },
      ),
    tickets: /* @ngInject */ ($transition$, ticketService) => ticketService
      .query($transition$.params()),
  },
  url: '/tickets?filters&pageNumber&pageSize&sortBy&sortOrder',
  views: {
    'support@support': component.name,
  },
};

export default {
  state,
};
