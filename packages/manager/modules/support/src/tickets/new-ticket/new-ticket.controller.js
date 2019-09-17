import angular from 'angular';
import get from 'lodash/get';
import last from 'lodash/last';

export default class SupportNewController {
  /* @ngInject */
  constructor($state, $window, CORE_URLS, OvhApiMe, OvhApiSupport) {
    this.step = 'issues';
    this.$state = $state;
    this.$window = $window;
    this.CORE_URLS = CORE_URLS;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiSupport = OvhApiSupport;
  }

  $onInit() {
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
      this.issues = result.issues;
      this.service = result.service;
      this.$window.scrollTo(0, 0);
    }
  }

  static generateBody(issues) {
    // generate ticket body from list of issue's fields
    let body = '';
    const issue = last(issues);
    body += `${issue.subject}\n`;
    issue.fields.forEach((field) => {
      body += `${field.label}\n${field.default}\n`;
    });
    body += '\n';
    return body;
  }

  getTicketURL(id) {
    return this.$state.href('support.tickets.ticket', {
      id,
    });
  }

  getTicketsURL() {
    return this.$state.href('support.tickets');
  }

  onCreationFormSubmit(result) {
    // user validates the form, post the ticket
    if (result.isSuccess) {
      this.step = 'creating';
      this.OvhApiSupport.v6().createTickets({}, {
        issueTypeId: get(last(result.issues), 'id'),
        serviceName: get(this.service, 'serviceName'),
        subject: result.subject,
        body: SupportNewController.generateBody(result.issues),
        urgency: get(result, 'urgency.id'),
      }).$promise.then(({ ticketId }) => {
        this.step = 'created';
        this.ticketId = ticketId;
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
      this.issues = null;
    }
  }
}
