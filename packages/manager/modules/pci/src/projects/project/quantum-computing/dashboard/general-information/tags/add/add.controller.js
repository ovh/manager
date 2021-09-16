import get from 'lodash/get';
import Notebook from '../../../../QuantumComputing.class';
import { NOTEBOOK_LABELS } from '../../../../add/notebook.constants';

export default class PciNotebookTagsAddController {
  /* @ngInject */
  constructor($translate, QuantumService) {
    this.$translate = $translate;
    this.QuantumService = QuantumService;

    this.label = Notebook.generateLabel();
    this.NOTEBOOK_LABELS = NOTEBOOK_LABELS;
  }

  canAddTag() {
    return !this.isUpdating && this.label.id && this.label.title;
  }

  onAddTagConfirm() {
    this.trackQuantumComputing('dashboard::add_new_tag_confirm');

    const labels = this.notebook.convertLabels(
      this.notebook.simulateAddLabel(this.label),
    );

    this.isUpdating = true;
    return this.QuantumService.updateNotebook(
      this.projectId,
      this.notebook.id,
      { labels },
    )
      .then(() => {
        return this.goBack().then(() => {
          return this.notebook.addLabel(this.label);
        });
      })
      .catch((err) => {
        return this.goBack(
          this.$translate.instant(
            'pci_quantum_computing_notebooks_general_information_info_tags_add_action_add_fail',
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

  onAddTagCancel() {
    this.trackQuantumComputing('dashboard::add_new_tag_cancel');
    return this.goBack();
  }
}
