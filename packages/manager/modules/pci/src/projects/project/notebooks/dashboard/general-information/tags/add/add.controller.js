import get from 'lodash/get';
import Notebook from '../../../../Notebook.class';

export default class PciNotebookTagsAddController {
  /* @ngInject */
  constructor($translate, NotebookService) {
    this.$translate = $translate;
    this.NotebookService = NotebookService;

    this.label = Notebook.generateLabel();
  }

  canAddTag() {
    return !this.isUpdating && this.label.id && this.label.title;
  }

  addTag() {
    const labels = this.notebook.convertLabels(
      this.notebook.simulateAddLabel(this.label),
    );

    this.isUpdating = true;
    return this.NotebookService.updateNotebook(
      this.projectId,
      this.notebook.id,
      { labels },
    )
      .then(() => {
        return this.goBack(
          this.$translate.instant(
            'pci_notebooks_general_information_info_tags_add_action_add_success',
          ),
        ).then(() => this.notebook.addLabel(this.label));
      })
      .catch((err) => {
        return this.goBack(
          this.$translate.instant(
            'pci_notebooks_general_information_info_tags_add_action_add_fail',
            {
              message: get(err, 'data.message'),
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isUpdating = false;
      });
  }
}
