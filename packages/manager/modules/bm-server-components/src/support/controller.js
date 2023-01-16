import {
  SUPPORT_LEVELS,
  SUPPORT_TICKET_URL,
  VIEW_SUPPORT_TICKET,
} from './constants';

export default class DedicatedServerSupportTileController {
  /* @ngInject */
  constructor(
    $http,
    $translate,
    $q,
    $window,
    atInternet,
    coreURLBuilder,
    coreConfig,
  ) {
    this.$http = $http;
    this.$translate = $translate;
    this.$q = $q;
    this.$window = $window;
    this.atInternet = atInternet;
    this.coreURLBuilder = coreURLBuilder;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.supportLevel = null;
    this.numberOfTickets = 0;
    this.numberOfInterventions = 0;
    this.viewTicketsUrl = this.getViewTicketsUrl();
    this.createNewTicketUrl = this.getCreateNewTicketUrl();
    this.loading = true;
    this.$q
      .all({
        support: this.loadSupportLevel(),
        tickets: this.loadSupportTickets(),
      })
      .then(({ support, tickets }) => {
        this.supportLevel = support.level;
        this.numberOfTickets = tickets.length;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadSupportLevel() {
    return this.$http.get('/me/supportLevel').then((response) => response.data);
  }

  loadSupportTickets() {
    return this.$http
      .get(`/support/tickets?serviceName=${this.serviceName}`)
      .then((response) => response.data);
  }

  getFormatedSupportLevel() {
    return SUPPORT_LEVELS[this.supportLevel] || this.supportLevel;
  }

  getViewTicketsUrl() {
    return this.coreConfig.isRegion(['EU', 'CA'])
      ? VIEW_SUPPORT_TICKET
      : this.coreURLBuilder.buildURL('dedicated', '#/support/tickets', {
          filters: JSON.stringify({
            property: 'serviceName.value',
            operator: 'is',
            value: this.serviceName,
          }),
        });
  }

  getCreateNewTicketUrl() {
    return this.coreConfig.isRegion(['EU', 'CA'])
      ? SUPPORT_TICKET_URL
      : this.coreURLBuilder.buildURL('dedicated', '#/support/tickets/new');
  }

  trackClick(trackText) {
    if (this.trackingPrefix) {
      this.atInternet.trackClick({
        name: `${this.trackingPrefix}::${trackText}`,
        type: 'action',
      });
    }
  }
}
