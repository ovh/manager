import angular from 'angular';
import get from 'lodash/get';
import { ISSUE_TYPES, TICKET_STEPS } from './new-ticket.constant';

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
    this.TICKET_STEPS = TICKET_STEPS;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiSupport = OvhApiSupport;
    this.SupportNewTicketService = SupportNewTicketService;
  }

  $onInit() {
    this.step = this.TICKET_STEPS.issues;

    this.guideURL = this.urls.guide;
    this.forumURL = this.urls.forum;
    this.fetchingData = false;
    if (this.preFetchData) this.preFetchDataFromApi();
  }

  onIssuesFormSubmit(result) {
    // user found answer, go back to tickets list
    if (result.isSuccess) {
      this.goToTickets();
      // answer was not found, go to ticket creation
    } else {
      this.step = this.TICKET_STEPS.creation;
      this.issue = result.issue;
      this.service = result.service;
      this.serviceType = result.serviceType;
      this.$window.scrollTo(0, 0);
    }
  }

  preFetchDataFromApi() {
    this.fetchingData = true;
    this.step = this.TICKET_STEPS.creation;
    return this.SupportNewTicketService.fetchIssueTypes(this.categoryName).then(
      (issueTypes) => {
        this.fetchingData = false;
        [this.issue] = issueTypes.filter(
          (issue) => issue.id === ISSUE_TYPES.NO_SERVICE_ID,
        );
        this.$window.scrollTo(0, 0);
      },
    );
  }

  onCreationFormSubmit(result) {
    this.step = this.TICKET_STEPS.creating;
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
        this.step = this.TICKET_STEPS.created;
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
        this.step = this.TICKET_STEPS.error;
      });
  }

  goBack() {
    this.step = this.TICKET_STEPS.issues;
  }

  handleBackButton() {
    if (this.step !== this.TICKET_STEPS.creation) {
      return this.$state.go('support.tickets');
    }

    this.step = this.TICKET_STEPS.issues;
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
