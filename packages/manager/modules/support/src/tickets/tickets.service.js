import mapValues from 'lodash/mapValues';

import { FROM as TICKET_MESSAGE_FROM } from './ticket/message/message.constants';
import { STATUS as TICKET_STATUS } from './ticket/ticket.constants';

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

  buildGridColumnLastMessageFromTypeOptions() {
    return {
      values: mapValues(
        TICKET_MESSAGE_FROM,
        (from) => this.ticketMessageService.translateFrom(from),
      ),
    };
  }

  buildGridColumnStateTypeOptions() {
    return {
      values: mapValues(
        TICKET_STATUS,
        (status) => this.ticketService.translateState(status),
      ),
    };
  }
}
