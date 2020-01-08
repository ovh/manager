export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loadMessages();
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
}
