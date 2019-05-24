export default class {
  /* @ngInject */
  constructor(
    $translate,
  ) {
    this.$translate = $translate;
  }

  translateTicketSender(sender) {
    return this.$translate.instant(`ticket_sender_${sender}`);
  }

  translateTicketState(state) {
    return this.$translate.instant(`ticket_state_${state}`);
  }
}
