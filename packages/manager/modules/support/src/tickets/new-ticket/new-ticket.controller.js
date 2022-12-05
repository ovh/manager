import angular from 'angular';
import get from 'lodash/get';
import { VPS_CUSTOMERS_RENEW_ISSUES_LINK } from './new-ticket.constants';

export default class SupportNewController {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $window,
    $translate,
    CORE_URLS,
    OvhApiMe,
    OvhApiSupport,
    SupportNewTicketService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$window = $window;
    this.$translate = $translate;
    this.CORE_URLS = CORE_URLS;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiSupport = OvhApiSupport;
    this.SupportNewTicketService = SupportNewTicketService;
  }

  $onInit() {
    this.step = 'issues';

    this.guideURL = this.urls.guide;
    this.forumURL = this.urls.forum;

    this.VPS_CUSTOMERS_RENEW_ISSUES_LINK = VPS_CUSTOMERS_RENEW_ISSUES_LINK;
  }

  onIssuesFormSubmit(result) {
    // user found answer, go back to tickets list
    if (result.isSuccess) {
      this.goToTickets();
      // answer was not found, go to ticket creation
    } else {
      this.step = 'creation';
      this.issue = result.issue;
      this.service = result.service;
      this.serviceType = result.serviceType;
      this.$window.scrollTo(0, 0);
    }
  }

  onCreationFormSubmit(result) {
    this.step = 'creating';
    let serviceName;
    let impactedResource;
    if (/\/kubernetes\//.test(get(this.service, 'url'))) {
      [serviceName, impactedResource] = get(this.service, 'stateParams');
    } else {
      serviceName = get(this.service, 'serviceName');
    }
    this.SupportNewTicketService.createTicket(
      result.issue,
      result.subject,
      serviceName,
      impactedResource,
      get(result, 'urgency'),
    )
      .then(({ ticketId }) => this.SupportNewTicketService.getTicket(ticketId))
      .then((ticket) => {
        this.step = 'created';
        this.ticketId = ticket.ticketId;
        this.ticketNumber = ticket.ticketNumber;
      })
      .catch((error) => {
        this.error = {
          message: (error.data || { message: error.statusText }).message,
          class: get(error, 'data.class'),
        };
        if (angular.isFunction(error.headers)) {
          this.error.queryId = error.headers('x-ovh-queryid');
        }
        this.step = 'error';
      });
  }

  goBack() {
    this.step = 'issues';
  }

  handleBackButton() {
    if (this.step !== 'creation') {
      return this.$state.go('support.tickets');
    }

    this.step = 'issues';
    return this.$q.when();
  }

  isDedicatedServer() {
    return get(this.serviceType, 'name') === 'dedicated_server';
  }

  getErrorMessage() {
    if (this.isDedicatedServer() && this.error.class) {
      if (this.error.class === 'Client::BadRequest::AlreadyOpened') {
        return this.$translate.instant(
          'ovhManagerSupport_new_creation_error_dedicated_server_already_opened',
        );
      }
      if (this.error.class === 'Client::BadRequest::ServiceMandatory') {
        return this.$translate.instant(
          'ovhManagerSupport_new_creation_error_dedicated_server_service_mandatory',
        );
      }
    }

    return this.error.message;
  }
}
