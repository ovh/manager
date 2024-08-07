import { get } from 'lodash-es';
import { Ticket as SupportTicket } from '@ovh-ux/manager-models';
import { MAX_TICKETS_TO_DISPLAY, SUPPORT_URLS } from './constants';

export default class ManagerHubSupportCtrl {
  /* @ngInject */
  constructor(
    $http,
    $q,
    atInternet,
    coreURLBuilder,
    RedirectionService,
    coreConfig,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.atInternet = atInternet;
    this.coreURLBuilder = coreURLBuilder;
    this.coreConfig = coreConfig;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    this.error = false;
    this.isLoading = true;
    this.me = this.coreConfig.getUser();
    this.isSupportWithExternalLinks = this.coreConfig.isRegion(['EU', 'CA']);
    this.SUPPORT_URL = this.isSupportWithExternalLinks
      ? SUPPORT_URLS.allTickets + this.me.ovhSubsidiary
      : this.coreURLBuilder.buildURL('dedicated', '#/ticket');
    this.guideURL = this.RedirectionService.getURL('guides.home', {
      ovhSubsidiary: this.me.ovhSubsidiary,
    });
    this.handleTicketsResponse(this.fetchTickets());
  }

  createTicket(ticket) {
    const { ticketId } = ticket;
    const url = this.isSupportWithExternalLinks
      ? SUPPORT_URLS.viewTicket.replace('{ticketId}', ticketId) +
        this.me.ovhSubsidiary
      : this.coreURLBuilder.buildURL(
          'dedicated',
          '#/support/tickets/:ticketId',
          {
            ticketId,
          },
        );
    return new SupportTicket({
      ...ticket,
      url,
    });
  }

  fetchTickets(cache = true) {
    const params = {
      serviceType: 'aapi',
    };

    if (!cache) {
      params.headers = {
        Pragma: 'no-cache',
      };
    }

    return this.$http
      .get('/hub/support', params)
      .then(({ data }) => data)
      .then((result) => get(result, 'data.support.data'));
  }

  refreshTickets() {
    this.handleTicketsResponse(this.fetchTickets(false));
  }

  onSeeMore() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::activity::assistance::show-all`,
      type: 'navigation',
    });
  }

  handleTicketsResponse(response) {
    response
      .then(({ data, count }) => {
        if (Array.isArray(data)) {
          this.tickets = data
            .slice(0, MAX_TICKETS_TO_DISPLAY)
            .map((ticket) => this.createTicket(ticket));
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
}
