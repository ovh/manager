import get from 'lodash/get';
import {
  NOTEBOOK_FLAVOR_TYPE,
  NOTEBOOK_VOLUME_TYPE,
} from '../../notebook.constants';
import Notebook from '../../Notebook.class';

export default class {
  /* @ngInject */
  constructor($translate, coreURLBuilder, CucCloudMessage, NotebookService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.NotebookService = NotebookService;

    this.NOTEBOOK_VOLUME_TYPE = NOTEBOOK_VOLUME_TYPE;
    this.NOTEBOOK_FLAVOR_TYPE = NOTEBOOK_FLAVOR_TYPE;
    this.billingUrl = coreURLBuilder.buildURL('dedicated', '#/billing/history');
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.notebooks.dashboard.general-information';
    this.loadMessages();

    this.notebookModel = Notebook.notebookCommandModel(this.notebook);
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  onLabelRemove(label) {
    const labels = this.notebook.convertLabels(
      this.notebook.simulateRemoveLabel(label),
    );

    return this.NotebookService.updateNotebook(
      this.projectId,
      this.notebook.id,
      { labels },
    )
      .then(() => {
        this.notebook.removeLabel(label);
        return this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_notebooks_general_information_info_notebook_tags_tag_remove_success',
          ),
        );
      })
      .catch((error) => {
        this.notebook.addLabel(label);
        return this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_notebooks_general_information_info_notebook_tags_tag_remove_fail',
            {
              message: get(error, 'data.message'),
            },
          ),
        );
      });
  }
}
