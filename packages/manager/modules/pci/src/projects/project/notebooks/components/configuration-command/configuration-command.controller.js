import omit from 'lodash/omit';
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

  getFilteredVolumes() {
    return this.notebookSpecs.volumes.flatMap((volume) => {
      let toRemove = false;
      let internalKey;
      Object.keys(volume).forEach((key) => {
        if (volume[key] && volume[key].internal !== undefined) {
          if (volume[key].internal === true) {
            toRemove = true;
          } else {
            internalKey = key;
          }
        }
      });
      if (toRemove) {
        return [];
      }
      return internalKey ? omit(volume, `${internalKey}.internal`) : volume;
    });
  }

  getConfigurationCommand() {
    this.loading = true;
    if (this.notebookSpecs.volumes) {
      // API does not accept volumes' internal property. We remove it before sending the request.
      this.notebookSpecs.volumes = this.getFilteredVolumes();
    }
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
