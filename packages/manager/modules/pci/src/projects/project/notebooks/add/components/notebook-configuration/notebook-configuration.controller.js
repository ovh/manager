import { NOTEBOOK_LABELS, NOTEBOOK_NAME_REGEX } from '../../notebook.constants';

export default class NotebookConfigurationController {
  static createLabel(key = null, value = null) {
    return { key, value };
  }

  constructor() {
    this.NOTEBOOK_NAME_REGEX = NOTEBOOK_NAME_REGEX;
    this.NOTEBOOK_LABELS = NOTEBOOK_LABELS;
  }

  addLabel(label) {
    this.notebookModel.labels.push(label);
  }

  removeLabel(key, value) {
    const labelIndex = this.notebookModel.labels.findIndex(
      (label) => label.key === key && label.value === value,
    );
    this.notebookModel.label.splice(labelIndex, labelIndex >= 0 ? 1 : 0);
  }

  maxLabelsIsReached() {
    return this.notebookModel.labels.length >= NOTEBOOK_LABELS.MAX_ITEMS;
  }

  onInlineAdderRemoveBtnClick(form) {
    this.removeLabel(
      form.configurationNotebookLabelKey.$modelValue,
      form.configurationNotebookLabelValue.$modelValue,
    );
  }

  onInlineAdderAddBtnClick(form) {
    if (!this.maxLabelsIsReached()) {
      this.addLabel(
        NotebookConfigurationController.createLabel(
          form.configurationNotebookLabelKey.$modelValue,
          form.configurationNotebookLabelValue.$modelValue,
        ),
      );
    }
  }
}
