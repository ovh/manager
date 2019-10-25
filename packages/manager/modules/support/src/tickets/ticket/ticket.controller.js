import { EVENT_NAMES } from '../../support.constants';

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
    this.$scope.$emit(EVENT_NAMES.startLoading);

    return this
      .ticketService
      .close(this.ticket.ticketId)
      .then(() => this.reload())
      .finally(() => {
        this.$scope.$emit(EVENT_NAMES.stopLoading);
      });
  }

  reply() {
    this.$scope.$emit(EVENT_NAMES.startLoading);

    return this
      .ticketService
      .reply(this.ticket.ticketId, this.replyMessage)
      .then(() => this.reload())
      .finally(() => {
        this.$scope.$emit(EVENT_NAMES.stopLoading);
      });
  }
}
