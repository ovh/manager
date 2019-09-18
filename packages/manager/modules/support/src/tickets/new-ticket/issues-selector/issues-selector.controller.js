import get from 'lodash/get';

export default class SupportIssuesSelectorController {
  /* @ngInject */
  constructor($q, $translate, OvhApiSupport) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiSupport = OvhApiSupport;
  }

  $onInit() {
    this.rank = this.rank || 1;
  }

  get root() {
    return this.rootValue;
  }

  set root(value) {
    this.issueType = null;
    this.rootValue = value;
    this.fetchIssueTypes();
  }

  get category() {
    return this.categoryValue;
  }

  set category(value) {
    this.issueType = null;
    this.categoryValue = value;
    this.fetchIssueTypes();
  }

  get serviceType() {
    return this.serviceTypeValue;
  }

  set serviceType(value) {
    this.issueType = null;
    this.serviceTypeValue = value;
    this.fetchIssueTypes();
  }

  get issuesHierarchy() {
    let parentIssues = [];
    if (this.parent) {
      parentIssues = this.parent.issuesHierarchy;
    }
    if (!this.issueType) return parentIssues;
    return parentIssues.concat(this.issueType);
  }

  canFetchIssues() {
    return this.rootValue
      && this.categoryValue
      && (this.serviceTypeValue || this.categoryValue.id === 'account');
  }

  fetchIssueTypes() {
    if (!this.canFetchIssues()) return this.$q.when();
    return this.OvhApiSupport.v6().getIssueTypes({
      category: this.categoryValue.id,
      issueTypeId: this.root === true ? undefined : this.root,
      language: this.$translate.use(),
      serviceType: get(this.serviceTypeValue, 'name'),
    }).$promise.then((items) => {
      this.issueTypes = items;
      if (items.length === 0) {
        this.notifyAllIssuesSelected(this.issuesHierarchy);
      } else if (items.length === 1) {
        [this.issueType] = items;
        this.onIssueTypeChange();
      }
    });
  }

  notifyAllIssuesSelected(issues) {
    if (this.parent) {
      return this.parent.notifyAllIssuesSelected(issues);
    }
    return this.onIssues({ issues });
  }

  onIssueTypeChange() {
    if (this.issueType.hasChildren) {
      this.onIssues({ issues: null });
    } else {
      this.notifyAllIssuesSelected(this.issuesHierarchy);
    }
  }
}
