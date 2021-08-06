import get from 'lodash/get';
import {
  NOTEBOOK_FLAVOR_TYPE,
  NOTEBOOK_MULTIPLY_SIGN,
  NOTEBOOK_VOLUME_TYPE,
} from '../../notebook.constants';
import Notebook from '../../Notebook.class';

export default class {
  /* @ngInject */
  constructor(
    $filter,
    $translate,
    coreURLBuilder,
    CucCloudMessage,
    NotebookService,
  ) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.NotebookService = NotebookService;

    this.NOTEBOOK_VOLUME_TYPE = NOTEBOOK_VOLUME_TYPE;
    this.NOTEBOOK_FLAVOR_TYPE = NOTEBOOK_FLAVOR_TYPE;
    this.NOTEBOOK_MULTIPLY_SIGN = NOTEBOOK_MULTIPLY_SIGN;
    this.billingUrl = coreURLBuilder.buildURL('dedicated', '#/billing/history');
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.notebooks.dashboard.general-information';
    this.loadMessages();

    this.notebookModel = Notebook.notebookCommandModel(this.notebook);
    this.notebookActionsHistory = [];
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

  getCpuRamInfo() {
    return `${this.$filter('cucBytes')(
      this.flavor.resourcesPerUnit.memory,
      0,
      false,
      'B',
    )} RAM (${NOTEBOOK_FLAVOR_TYPE.CPU})`;
  }

  getGpuRamInfo() {
    return this.flavor.gpuInformation
      ? `${this.$filter('cucBytes')(
          this.flavor.gpuInformation.gpuMemory,
          0,
          false,
          'B',
        )} RAM (${NOTEBOOK_FLAVOR_TYPE.GPU})`
      : null;
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

  onNotebookStartClick(notebookId) {
    this.trackNotebooks('dashboard::options_menu::start_notebook');
    return this.startNotebook(notebookId);
  }

  onNotebookStopClick(notebookId) {
    this.trackNotebooks('dashboard::options_menu::stop_notebook');
    return this.stopNotebook(notebookId);
  }

  onOpenLiveCodeEditorClick(editorId) {
    this.trackNotebooks(`dashboard::open_${editorId}`);
    this.openLiveCodeEditor();
  }

  onGraphDashboardClick() {
    this.trackNotebooks('dashboard::access_graph_dashboard');
  }

  onAddNewTagClick() {
    this.trackNotebooks('dashboard::add_new_tag');
    return this.goToAddTag();
  }

  onDeleteNotebookClick() {
    this.trackNotebooks('dashboard::delete_notebook');
    return this.goToDeleteNotebook();
  }
}
