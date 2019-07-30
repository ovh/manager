import _ from 'lodash';

import { FROM as TICKET_MESSAGE_FROM } from '../models/ticket/message/message.constants';
import { STATUS as TICKET_STATUS } from '../models/ticket/ticket.constants';

export default class TicketsService {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    OvhApiSupport,
    ticketService,
    ticketMessageService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiSupport = OvhApiSupport;
    this.ticketService = ticketService;
    this.ticketMessageService = ticketMessageService;
  }

  static transformTicketsForGrid(tickets) {
    return _.map(
      tickets,
      ticket => _.assign(
        ticket,
        {
          ticketNumber: +ticket.ticketNumber,
          creationDate: new Date(Date.parse(ticket.creationDate)),
          updateDate: new Date(Date.parse(ticket.updateDate)),
        },
      ),
    );
  }

  buildGridColumnLastMessageFromTypeOptions() {
    return {
      values: _.reduce(
        _.values(TICKET_MESSAGE_FROM),
        (previousValue, from) => ({
          ...previousValue,
          [from]: this.ticketMessageService.translateFrom(from),
        }),
        {},
      ),
    };
  }

  buildGridColumnStateTypeOptions() {
    return {
      values: _.reduce(
        _.values(TICKET_STATUS),
        (previousValue, status) => ({
          ...previousValue,
          [status]: this.ticketService.translateState(status),
        }),
        {},
      ),
    };
  }
}
