import { DOCUMENTATION_LINK } from './configuration-command.constants';

export default class {
  /* @ngInject */
  constructor($translate, coreConfig, NotebookService) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.NotebookService = NotebookService;
  }

  $onInit() {
    this.loading = false;
    this.command = '';
    const ovhSubsidiary = this.coreConfig.getUser()?.ovhSubsidiary;
    this.documentationLink =
      DOCUMENTATION_LINK[ovhSubsidiary] || DOCUMENTATION_LINK.DEFAULT;
    this.getConfigurationCommand();
  }

  getConfigurationCommand() {
    this.loading = true;
    return this.NotebookService.getNotebookConfigurationCommand(
      this.projectId,
      this.notebookSpecs,
    )
      .then((command) => {
        this.command = command;
      })
      .catch((error) => {
        this.command = this.$translate.instant(
          'pci_notebook_configuration_command_error',
          { message: error.data?.message },
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
