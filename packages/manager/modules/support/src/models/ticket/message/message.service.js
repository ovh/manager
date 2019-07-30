import Message from './message';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    OvhApiSupport,
  ) {
    this.$translate = $translate;
    this.OvhApiSupport = OvhApiSupport;
  }

  buildFromApi(messageFromApi) {
    const message = new Message(messageFromApi);
    message.from = {
      value: message.from,
      display: this.translateFrom(message.from),
    };
    return message;
  }

  translateFrom(from) {
    return this.$translate.instant(`ovhManagerSupport_ticket_message_from_${from}`);
  }

  query(ticketId) {
    return this
      .OvhApiSupport
      .v6()
      .queryMessages({ id: ticketId }).$promise;
  }
}
