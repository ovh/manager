import { NOTEBOOK_LABELS } from '../../notebook.constants';

export default class NotebookConfigurationController {
  static createLabel(key = null, value = null) {
    return { key, value };
  }

  constructor() {
    this.NOTEBOOK_LABELS = NOTEBOOK_LABELS;

    this.myLabels = [
      NotebookConfigurationController.createLabel(),
      NotebookConfigurationController.createLabel(),
    ];
  }

  addLabel(label) {
    this.notebookModel.labels.push(label);
  }

  removeLabel(label) {
    const labelIndex = this.notebookModel.labels.findIndex(
      ({ key, value }) => label.key === key && label.value === value,
    );
    this.notebookModel.labels.splice(labelIndex, labelIndex >= 0 ? 1 : 0);
  }

  labelKeyExist(label) {
    const { labels } = this.notebookModel;
    const foundLabel = labels.find(({ key }) => label.key === key);
    return (
      labels.length > 0 && foundLabel !== undefined && label !== foundLabel
    );
  }

  maxLabelsIsReached() {
    return this.notebookModel.labels.length >= NOTEBOOK_LABELS.MAX_ITEMS;
  }

  canAddNewLabel() {
    return (
      this.notebookModel.labels.length === 0 ||
      !(this.maxLabelsIsReached() || this.notebookConfigurationForm.$invalid)
    );
  }

  onAddLabelClick() {
    if (!this.maxLabelsIsReached()) {
      this.addLabel(NotebookConfigurationController.createLabel());
    }
  }

  onKeyLabelEdit(label, labelId) {
    if (this.labelKeyExist(label)) {
      return this.notebookConfigurationForm[labelId].$setValidity(
        'duplicateLabelKey',
        false,
      );
    }

    return this.notebookConfigurationForm[labelId].$setValidity(
      'duplicateLabelKey',
      true,
    );
  }

  onRemoveLabelClick(label) {
    this.removeLabel(label);
  }
}
