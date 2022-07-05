import set from 'lodash/set';

import otrsDetailCtrl from './detail/otrs-detail.controller';
import otrsDetailTemplate from './detail/otrs-detail.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.otrs', {
    url: '',
    template: '<data-ui-view></data-ui-view>',
  });

  $stateProvider.state('app.otrs.tickets', {
    url: '/ticket?archived&filters&pageNumber&pageSize&sortBy&sortOrder',
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
    views: {
      '': {
        component: 'otrsComponent',
      },
    },
    resolve: {
      hideBreadcrumb: () => true,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('otrs_title'),
      archived: /* @ngInject */ ($transition$) =>
        !!$transition$.params().archived,
      filters: /* @ngInject */ ($transition$) => $transition$.params().filters,
      onGridParamsChange: /* @ngInject */ ($state) => (params) =>
        $state.go('.', { ...$state.params, ...params }, { notify: false }),
      pageNumber: /* @ngInject */ ($transition$) =>
        $transition$.params().pageNumber,
      pageSize: /* @ngInject */ ($transition$) =>
        $transition$.params().pageSize,
      reload: /* @ngInject */ ($state) => (params) =>
        $state.transitionTo(
          $state.current,
          { ...$state.params, ...params },
          { reload: true, inherit: false },
        ),
      sortBy: /* @ngInject */ ($transition$) => $transition$.params().sortBy,
      sortOrder: /* @ngInject */ ($transition$) =>
        $transition$.params().sortOrder,
      goToTicket: /* @ngInject */ ($state) => (ticketId) =>
        $state.go('app.otrs.tickets.details', {
          ticketId,
        }),
      tickets: /* @ngInject */ ($translate, OvhApiSupport, archived) =>
        OvhApiSupport.Iceberg()
          .query()
          .expand('CachedObjectList-Pages')
          .execute({ archived }, true)
          .$promise.then(({ data: tickets = [] }) =>
            tickets.map((ticket) => {
              set(ticket, 'serviceName', {
                display:
                  ticket.serviceDescription ||
                  ticket.serviceName ||
                  $translate.instant('otrs_service_other_services'),
                value: ticket.serviceName,
              });
              set(ticket, 'state', {
                display: $translate.instant(
                  `otrs_table_ticket_state_${ticket.state}`,
                ),
                value: ticket.state,
              });
              set(ticket, 'lastMessageFrom', {
                display: $translate.instant(
                  `otrs_table_ticket_lastMessageFrom_${ticket.lastMessageFrom}`,
                ),
                value: ticket.lastMessageFrom,
              });
              return ticket;
            }),
          ),
    },
  });

  $stateProvider.state('app.otrs.tickets.details', {
    url: '/:ticketId',
    views: {
      '@^.^': {
        controller: otrsDetailCtrl,
        template: otrsDetailTemplate,
      },
    },
    resolve: {
      ticketId: /* @ngInject */ ($transition$) =>
        $transition$.params().ticketId,
      breadcrumb: /* @ngInject */ (ticketId) => ticketId,
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
  });
};
