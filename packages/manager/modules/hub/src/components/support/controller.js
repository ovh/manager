import get from 'lodash/get';
import { Ticket as SupportTicket } from '@ovh-ux/manager-models';
import { MAX_TICKETS_TO_DISPLAY } from './constants';

export default class ManagerHubSupportCtrl {
  /* @ngInject */
  constructor($http, $q, RedirectionService) {
    this.$http = $http;
    this.$q = $q;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    this.isLoading = true;
    this.guideURL = this.RedirectionService.getURL('guides.home', {
      ovhSubsidiary: this.me.ovhSubsidiary,
    });
    return this.$q
      .when(this.tickets ? this.tickets : this.fetchTickets())
      .then((tickets) => {
        if (Array.isArray(tickets)) {
          this.tickets = tickets
            .slice(0, MAX_TICKETS_TO_DISPLAY)
            .map((ticket) => new SupportTicket(ticket));
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  fetchTickets() {
    return this.$http
      .get('/hub/support', {
        serviceType: 'aapi',
      })
      .then(({ data }) => data)
      .then((result) => get(result, 'data.support.data.data'));
  }
}
