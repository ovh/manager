import Message from './message.class';

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
    const message = messageFromApi;

    message.from = {
      display: this.translateFrom(messageFromApi.from),
      value: messageFromApi.from,
    };

    return new Message(message);
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
