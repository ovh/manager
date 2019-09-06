import findLast from 'lodash/findLast';

export default class SupportNewCreationFormController {
  /* @ngInject */
  constructor($q, $state, $translate, OvhApiService, OvhApiSupport) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.OvhApiService = OvhApiService;
    this.OvhApiSupport = OvhApiSupport;
  }

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
