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

  fetchIssueTypes() {
    if (!this.categoryValue) return this.$q.when();
    if (!this.serviceTypeValue) return this.$q.when();
    if (!this.rootValue) return this.$q.when();
    return this.OvhApiSupport.v6().getIssueTypes({
      category: this.categoryValue.id,
      issueTypeId: this.root === true ? undefined : this.root,
      language: this.$translate.use(),
      serviceType: this.serviceTypeValue.name,
    }).$promise.then((items) => {
      this.issueTypes = items;
      if (items.length === 0) {
        this.notifyAllIssuesSelected(this.issuesHierarchy);
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
