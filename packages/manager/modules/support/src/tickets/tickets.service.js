import map from 'lodash/map';
import reduce from 'lodash/reduce';
import values from 'lodash/values';

import {
  TICKET_SENDER,
  TICKET_STATUS,
} from '../support.constants';

export default class TicketsService {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    OvhApiSupport,
    supportService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiSupport = OvhApiSupport;
    this.supportService = supportService;
  }

  fetchTickets() {
    return this.OvhApiSupport.Iceberg()
      .query()
      .expand('CachedObjectList-Pages')
      .execute().$promise;
  }

  extractOrFetchTicketsForGrid({ tickets }) {
    return tickets || this.fetchTickets()
      .then(TicketsService.transformTicketsForGrid);
  }

  static transformTicketsForGrid(tickets) {
    return map(
      tickets,
      ticket => ({
        ...ticket,
        ticketNumber: +ticket.ticketNumber,
        creationDate: new Date(Date.parse(ticket.creationDate)),
        updateDate: new Date(Date.parse(ticket.updateDate)),
      }),
    );
  }

  buildGridColumnLastMessageFromTypeOptions() {
    return {
      values: reduce(
        values(TICKET_SENDER),
        (previousValue, sender) => ({
          ...previousValue,
          [sender]: this.supportService.translateTicketSender(sender),
        }),
        {},
      ),
    };
  }

  buildGridColumnStateTypeOptions() {
    return {
      values: reduce(
        values(TICKET_STATUS),
        (previousValue, status) => ({
          ...previousValue,
          [status]: this.supportService.translateTicketState(status),
        }),
        {},
      ),
    };
  }
}
