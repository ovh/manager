import findLast from 'lodash/findLast';

export default class SupportNewCreationFormController {
  get subject() {
    const issue = findLast(this.issues, 'subject');
    return issue ? issue.subject : undefined;
  }

  submitForm(isSuccess) {
    this.onSubmit({
      result: {
        isSuccess,
        issues: this.issues,
        subject: this.subject || this.customSubject,
      },
    });
  }
}
