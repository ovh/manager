import get from 'lodash/get';

export default class SupportNewCreationFormController {
  /* @ngInject */
  constructor(
    SupportNewTicketService,
  ) {
    this.SupportNewTicketService = SupportNewTicketService;
  }

  $onInit() {
    return this.SupportNewTicketService.getSupportLevel().then(({ level }) => {
      this.supportLevel = level;
      if (this.isBusinessSupportLevel()) {
        return this.SupportNewTicketService.getUrgencies().then((urgencies) => {
          this.urgencies = urgencies;
        });
      }
      return level;
    });
  }

  get subject() {
    return get(this.issue, 'subject');
  }

  isBusinessSupportLevel() {
    return ['business', 'enterprise'].indexOf(this.supportLevel) >= 0;
  }

  submitForm(isSuccess) {
    this.onSubmit({
      result: {
        isSuccess,
        issue: this.issue,
        subject: this.subject || this.customSubject,
        urgency: this.urgency,
      },
    });
  }
}
