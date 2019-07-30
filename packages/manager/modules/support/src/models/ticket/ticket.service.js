import _ from 'lodash';

import Ticket from './ticket';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    OvhApiSupport,
    ticketMessageService,
  ) {
    this.$translate = $translate;
    this.OvhApiSupport = OvhApiSupport;
    this.ticketMessageService = ticketMessageService;
  }

  buildFromApi(ticketFromApi) {
    const ticket = new Ticket(ticketFromApi);
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
    return ticket;
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

  query() {
    return this
      .OvhApiSupport
      .Iceberg()
      .query()
      .expand('CachedObjectList-Pages')
      .execute().$promise
      .then(tickets => _.map(
        tickets,
        ticket => this.buildFromApi(ticket),
      ));
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
