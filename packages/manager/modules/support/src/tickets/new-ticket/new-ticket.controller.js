import angular from 'angular';
import get from 'lodash/get';

export default class SupportNewController {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $window,
    CORE_URLS,
    OvhApiMe,
    OvhApiSupport,
    SupportNewTicketService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$window = $window;
    this.CORE_URLS = CORE_URLS;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiSupport = OvhApiSupport;
    this.SupportNewTicketService = SupportNewTicketService;
  }

  $onInit() {
    this.step = 'issues';

    this.guideURL = this.urls.guide;
    this.forumURL = this.urls.forum;
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
      this.$window.scrollTo(0, 0);
    }
  }

  onCreationFormSubmit(result) {
    // user validates the form, post the ticket
    if (result.isSuccess) {
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
        }).catch((error) => {
          this.error = {
            message: (error.data || { message: error.statusText }).message,
          };
          if (angular.isFunction(error.headers)) {
            this.error.queryId = error.headers('x-ovh-queryid');
          }
          this.step = 'error';
        });
    // user cancelled the form, go back to tickets list
    } else {
      this.step = 'issues';
      this.issue = null;
    }
  }

  handleBackButton() {
    if (this.step !== 'creation') {
      return this.$state.go('support.tickets');
    }

    this.step = 'issues';
    return this.$q.when();
  }
}
