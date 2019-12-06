import head from 'lodash/head';

export default class SupportIssuesSelectorController {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    $translate,
    OvhApiSupport,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.OvhApiSupport = OvhApiSupport;
  }

  $onInit() {
    this.issueTypes = null;
    this.issueType = null;
    this.issue = null;

    this.isLoading = true;

    return this
      .fetchIssueTypes()
      .then(() => {
        this.isLoading = false;
      });
  }

  fetchIssueTypes() {
    return this.OvhApiSupport.v6()
      .getIssueTypes({
        category: this.category.id,
        issueTypeId: this.parentIssue && this.parentIssue.id,
        language: this.$translate.use(),
        serviceType: this.serviceType && this.serviceType.name,
      }).$promise
      .then((issues) => {
        this.issues = issues;

        if (issues.length === 1) {
          this.issue = head(issues);
          this.onChange({ changes: { issue: this.issue } });
        }
      });
  }

  onIssueChange() {
    const currentIssue = this.issue;
    this.issue = null;

    this.$timeout(() => {
      this.issue = currentIssue;
      this.onChange({ changes: { issue: this.issue } });
    });
  }

  onChildChange({ issue }) {
    this.onChange({ changes: { issue } });
  }
}
