import { get } from 'lodash-es';
import { Ticket as SupportTicket } from '@ovh-ux/manager-models';
import { MAX_TICKETS_TO_DISPLAY } from './constants';

export default class ManagerHubSupportCtrl {
  /* @ngInject */
  constructor($http, $q, atInternet, RedirectionService) {
    this.$http = $http;
    this.$q = $q;
    this.atInternet = atInternet;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    this.error = false;
    this.isLoading = true;
    this.guideURL = this.RedirectionService.getURL('guides.home', {
      ovhSubsidiary: this.me.ovhSubsidiary,
    });
    return this.$q
      .when(this.tickets ? this.tickets : this.fetchTickets())
      .then(({ data, count }) => {
        if (Array.isArray(data)) {
          this.tickets = data
            .slice(0, MAX_TICKETS_TO_DISPLAY)
            .map((ticket) => new SupportTicket(ticket));
        }
        this.ticketsCount = count;
      })
      .catch(() => {
        this.error = true;
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
      .then((result) => get(result, 'data.support.data'));
  }

  onSeeMore() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::activity::assistance::show-all`,
      type: 'navigation',
    });
  }
}
