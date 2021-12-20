import map from 'lodash/map';
import set from 'lodash/set';

import { Ticket } from '@ovh-ux/manager-models';

export default class TicketService {
  /* @ngInject */
  constructor($q, $translate, OvhApiSupport, ticketMessageService) {
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
    return this.OvhApiSupport.v6().close({ id }).$promise;
  }

  get(id) {
    return this.OvhApiSupport.v6().get({ id }).$promise;
  }

  getWithMessages(id) {
    return this.get(id)
      .then((ticketFromApi) => this.buildFromApi(ticketFromApi))
      .then((ticket) =>
        this.ticketMessageService.query(id).then((messagesFromApi) =>
          set(
            ticket,
            'messages',
            map(messagesFromApi, (messageFromApi) =>
              this.ticketMessageService.buildFromApi(messageFromApi),
            ),
          ),
        ),
      );
  }

  query(archived = false) {
    return this.OvhApiSupport.Iceberg()
      .query()
      .expand('CachedObjectList-Pages')
      .execute({ archived }, true)
      .$promise.then((tickets) =>
        map(tickets.data, (ticket) => this.buildFromApi(ticket)),
      );
  }

  reopen(id, body) {
    return this.OvhApiSupport.v6().reopen({ id }, { body }).$promise;
  }

  reply(id, body) {
    return this.OvhApiSupport.v6().reply({ id }, { body }).$promise;
  }

  translateServiceName(serviceName) {
    return (
      serviceName ||
      this.$translate.instant('ovhManagerSupport_ticket_serviceName_none')
    );
  }

  translateState(state) {
    return this.$translate.instant(`ovhManagerSupport_ticket_state_${state}`);
  }

  translateType(type) {
    return this.$translate.instant(`ovhManagerSupport_ticket_type_${type}`);
  }
}
