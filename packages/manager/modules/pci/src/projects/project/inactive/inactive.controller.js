export default class ProjectInactiveCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.title = this.$translate.instant(
      `pci_projects_project_inactive_title${
        this.project.isSuspended() ? '_suspended' : ''
      }${this.project.hasPendingDebt() ? '_pending_debt' : ''}`,
    );
    this.description = this.$translate.instant(
      `pci_projects_project_inactive_description${
        this.project.isSuspended() ? '_suspended' : ''
      }${this.project.hasPendingDebt() ? '_pending_debt' : ''}`,
    );
  }
}
