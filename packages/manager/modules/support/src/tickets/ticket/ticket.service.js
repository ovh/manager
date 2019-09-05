import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import lowerCase from 'lodash/lowerCase';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import uniqBy from 'lodash/uniqBy';

import Ticket from './ticket.class';

export default class TicketService {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    OvhApiSupport,
    ticketMessageService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiSupport = OvhApiSupport;
    this.ticketMessageService = ticketMessageService;
  }

  buildFromApi(ticketFromApi) {
    const ticket = ticketFromApi;

    ticket.creationDate = new Date(Date.parse(ticket.creationDate));
    ticket.lastMessageFrom = {
      display: this.ticketMessageService.translateFrom(ticket.lastMessageFrom),
      value: ticket.lastMessageFrom,
    };
    ticket.serviceName = {
      display: this.translateServiceName(ticket.serviceName),
      value: ticket.serviceName,
    };
    ticket.state = {
      display: this.translateState(ticket.state),
      value: ticket.state,
    };
    ticket.type = {
      display: this.translateType(ticket.type),
      value: ticket.type,
    };
    ticket.updateDate = new Date(Date.parse(ticket.updateDate));

    return new Ticket(ticket);
  }

  close(id) {
    return this
      .OvhApiSupport
      .v6()
      .close({ id }).$promise;
  }

  get(id) {
    return this
      .OvhApiSupport
      .v6()
      .get({ id }).$promise;
  }

  getWithMessages(id) {
    return this
      .get(id)
      .then(ticketFromApi => this.buildFromApi(ticketFromApi))
      .then(ticket => this.ticketMessageService
        .query(id)
        .then(messagesFromApi => set(
          ticket,
          'messages',
          map(
            messagesFromApi,
            messageFromApi => this.ticketMessageService.buildFromApi(messageFromApi),
          ),
        )));
  }

  query({
    cleanCache,
    filters,
    pageNumber,
    pageSize,
    sortBy,
    sortOrder,
  }) {
    let request = this
      .OvhApiSupport
      .Iceberg()
      .query()
      .expand('CachedObjectList-Pages')
      .limit(pageSize)
      .offset(pageNumber)
      .sort(sortBy, sortOrder);

    const nonSearchFilters = filter(
      filters,
      ({ field }) => isString(field),
    );

    forEach(
      nonSearchFilters,
      (nonSearchFilter) => {
        request = TicketService
          .addFilter(request, nonSearchFilter);
      },
    );

    const searchFilters = filter(
      filters,
      ({ field }) => isNil(field),
    );

    const requests = isEmpty(searchFilters)
      ? [request]
      : [];

    const searchableColumnNames = [
      'ticketNumber',
      'serviceName',
      'subject',
    ];

    forEach(
      searchableColumnNames,
      (columnName) => {
        let initialRequest = cloneDeep(request);

        forEach(
          searchFilters,
          (searchFilter) => {
            initialRequest = TicketService
              .addFilter(initialRequest, {
                ...searchFilter,
                field: columnName,
              });
          },
        );

        requests.push(initialRequest);
      },
    );

    return this
      .$q
      .all(map(
        requests,
        r => r
          .execute({}, cleanCache)
          .$promise,
      ))
      .then((results) => {
        const { headers } = reduce(
          results,
          (acc, r) => {
            if (acc.highestNumberOfElements <= r.headers['x-pagination-elements']) {
              return {
                highestNumberOfElements: r.headers['x-pagination-elements'],
                headers: r.headers,
              };
            }

            return acc;
          },
          {
            highestNumberOfElements: 0,
            headers: null,
          },
        );

        const tickets = orderBy(
          uniqBy(
            reduce(
              results,
              (acc, result) => acc.concat(result.data),
              [],
            ),
            'ticketNumber',
          ),
          sortBy,
          lowerCase(sortOrder),
        );

        if (isEmpty(tickets) && pageNumber !== 1) {
          return this
            .query({
              cleanCache,
              filters,
              pageNumber: 1,
              pageSize,
              sortBy,
              sortOrder,
            });
        }

        return {
          ...results[0],
          headers,
          data: map(
            tickets,
            ticket => this.buildFromApi(ticket),
          ),
        };
      });
  }

  static addFilter(request, { comparator, field, reference }) {
    const FILTER_OPERATORS = {
      contains: 'like',
      is: 'eq',
      isAfter: 'gt',
      isBefore: 'lt',
      isNot: 'ne',
      smaller: 'lt',
      bigger: 'gt',
      startsWith: 'like',
      endsWith: 'like',
    };

    return request.addFilter(
      field,
      FILTER_OPERATORS[comparator],
      map(
        reference,
        (val) => {
          switch (comparator.toUpperCase()) {
            case 'CONTAINS':
              return `%25${val}%25`;
            case 'STARTSWITH':
              return `${val}%25`;
            case 'ENDSWITH':
              return `%25${val}`;
            default:
              return val;
          }
        },
      ),
    );
  }

  reopen(id, body) {
    return this
      .OvhApiSupport
      .v6()
      .reopen({ id }, { body }).$promise;
  }

  reply(id, body) {
    return this
      .OvhApiSupport
      .v6()
      .reply({ id }, { body }).$promise;
  }

  translateServiceName(serviceName) {
    return serviceName || this.$translate.instant('ovhManagerSupport_ticket_serviceName_none');
  }

  translateState(state) {
    return this.$translate.instant(`ovhManagerSupport_ticket_state_${state}`);
  }

  translateType(type) {
    return this.$translate.instant(`ovhManagerSupport_ticket_type_${type}`);
  }
}
