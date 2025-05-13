export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loadMessages();

    this.redirectInfoBanner();
  }

  redirectInfoBanner() {
    const { isRedirectRequired, activeProjects } = this;

    if (isRedirectRequired && activeProjects.length > 1) {
      this.CucCloudMessage.info(
        this.$translate.instant('pci_projects_redirect_to_dedicated_page'),
      );
    }
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects', {
      onMessage: () => this.refreshMessages(),
    });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  deleteProject(project) {
    return this.terminateProject(project).then(() => {
      this.goToProjects(
        this.$translate.instant('pci_projects_project_delete_success'),
      );
    });
  }

  onCreateProjectClick() {
    this.trackClick('public-cloud_project-listing_create-instance');

    return this.goToNewProject();
  }

  onGoToProjectClick(project) {
    if (this.isRedirectRequired) {
      const stateTarget = this.getTargetedState(project);

      return this.goToState(stateTarget);
    }

    return this.goToProject(project);
  }
}
