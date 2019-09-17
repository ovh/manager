import findLast from 'lodash/findLast';
import last from 'lodash/last';

export default class SupportNewCreationFormController {
  /* @ngInject */
  constructor(SupportNewTicketService) {
    this.SupportNewTicketService = SupportNewTicketService;
  }

  $onInit() {
    return this.SupportNewTicketService.getSupportLevel().then((level) => {
      this.supportLevel = level;
      if (this.shouldSelectUrgency()) {
        return this.SupportNewTicketService.getUrgencies().then((urgencies) => {
          this.urgencies = urgencies;
        });
      }
      return level;
    });
  }

  get subject() {
    const issue = findLast(this.issues, 'subject');
    return issue ? issue.subject : undefined;
  }

  getLastIssue() {
    return last(this.issues);
  }

  shouldSelectUrgency() {
    return ['business', 'enterprise'].indexOf(this.supportLevel) >= 0;
  }

  submitForm(isSuccess) {
    this.onSubmit({
      result: {
        isSuccess,
        issues: this.issues,
        subject: this.subject || this.customSubject,
        urgency: this.urgency,
      },
    });
  }
}
