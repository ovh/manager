import get from 'lodash/get';

export default class SupportIssuesSelectorController {
  /* @ngInject */
  constructor($q, $translate, OvhApiSupport) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiSupport = OvhApiSupport;
  }

  $onInit() {
    this.issueTypes = null;
    this.issueType = null;
    this.issue = null;
  }

  $onChanges(changes) {
    if (changes.category || changes.serviceType || changes.parentIssue) {
      this.issue = null;
      this.issueType = null;
      this.fetchIssueTypes();
    }
  }

  fetchIssueTypes() {
    this.isLoading = true;
    return this.OvhApiSupport.v6().getIssueTypes({
      category: get(this.category, 'id'),
      issueTypeId: get(this.parentIssue, 'id'),
      language: this.$translate.use(),
      serviceType: get(this.serviceType, 'name'),
    }).$promise.then((items) => {
      this.issueTypes = items;
      if (items.length === 1) {
        [this.issueType] = items;
        this.issue = this.issueType;
      }
    }).finally(() => {
      this.isLoading = false;
    });
  }

  onIssueTypeSelected() {
    this.issue = this.issueType.hasChildren ? null : this.issueType;
  }
}
