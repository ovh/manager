import { EVENT_NAMES } from '../../support.constants';

export default class {
  /* @ngInject */
  constructor($scope, $http, ticketService) {
    this.$scope = $scope;
    this.$http = $http;
    this.ticketService = ticketService;
  }

  close() {
    this.$scope.$emit(EVENT_NAMES.startLoading);

    return this.ticketService
      .close(this.ticket.ticketId)
      .then(() => this.reload())
      .finally(() => {
        this.$scope.$emit(EVENT_NAMES.stopLoading);

        // This request is used to refresh the support's cache
        this.$http
          .get('/hub/support', {
            serviceType: 'aapi',
            headers: {
              Pragma: 'no-cache',
            },
          })
          .then(({ data }) => data);
      });
  }

  reply() {
    this.$scope.$emit(EVENT_NAMES.startLoading);

    return this.ticketService
      .reply(this.ticket.ticketId, this.replyMessage)
      .then(() => this.reload())
      .finally(() => {
        this.$scope.$emit(EVENT_NAMES.stopLoading);
      });
  }
}
