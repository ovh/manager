import { EVENTS } from '../support.constants';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    ticketService,
  ) {
    this.$scope = $scope;
    this.ticketService = ticketService;
  }

  close() {
    this.$scope.$emit(EVENTS.startLoading);

    return this
      .ticketService
      .close(this.ticket.ticketId)
      .then(() => this.reload());
  }

  reply() {
    this.$scope.$emit(EVENTS.startLoading);

    return this
      .ticketService
      .reply(this.ticket.ticketId, this.replyMessage)
      .then(() => this.reload());
  }

  reopen() {
    this.$scope.$emit(EVENTS.startLoading);

    return this
      .ticketService
      .reopen(this.ticket.ticketId, this.replyMessage)
      .then(() => this.reload());
  }
}
