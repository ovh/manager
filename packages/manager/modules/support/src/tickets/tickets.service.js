import mapValues from 'lodash/mapValues';

import { Ticket } from '@ovh-ux/manager-models';
import { FROM as TICKET_MESSAGE_FROM } from './ticket/message/message.constants';

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
      values: mapValues(TICKET_MESSAGE_FROM, (from) =>
        this.ticketMessageService.translateFrom(from),
      ),
    };
  }

  buildGridColumnStateTypeOptions() {
    return {
      values: mapValues(Ticket.Status, (status) =>
        this.ticketService.translateState(status),
      ),
    };
  }
}
