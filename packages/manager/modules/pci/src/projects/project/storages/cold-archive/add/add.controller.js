export default class ColdArchiveConfigurationController {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.archiveModel = { name: '' };

    this.messageContainer = 'pci.projects.project.storages.cold-archive.add';
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getNameArchiveStepHeader(display) {
    if (display === false) {
      return this.$translate.instant(
        'pci_projects_project_storages_cold_archive_add_step_name_archive_header_selected',
        {
          archiveName: this.archiveModel.name,
        },
      );
    }

    return this.$translate.instant(
      'pci_projects_project_storages_cold_archive_add_step_name_archive_header',
    );
  }

  onArchiveSubmit() {
    // TODO: will be completed in another Story
  }
}
