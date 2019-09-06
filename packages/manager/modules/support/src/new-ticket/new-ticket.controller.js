import angular from 'angular';
import get from 'lodash/get';
import last from 'lodash/last';

export default class SupportNewController {
  /* @ngInject */
  constructor($state, $window, OvhApiSupport) {
    this.step = 'issues';
    this.$state = $state;
    this.$window = $window;
    this.OvhApiSupport = OvhApiSupport;
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
    issues.forEach((issue) => {
      body += `${issue.subject}\n\n`;
      issue.fields.forEach((field) => {
        body += `${field.label}\n${field.default}\n\n`;
      });
      body += '\n';
    });
    return body;
  }

  getTicketURL(id) {
    return this.$state.href('support.tickets.ticket', {
      id,
      cleanCache: true,
    });
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
