import { APP_LABELS, APP_PRIVACY_SETTINGS } from '../../add.constants';
import { nameGenerator } from '../../../../../data-processing/data-processing.utils';

export default class AppConfigurationController {
  static createLabel(key = null, value = null) {
    return { key, value };
  }

  constructor() {
    this.APP_LABELS = APP_LABELS;
    this.APP_PRIVACY_SETTINGS = APP_PRIVACY_SETTINGS;

    this.myLabels = [
      AppConfigurationController.createLabel(),
      AppConfigurationController.createLabel(),
    ];
  }

  $onInit() {
    this.generateName();
  }

  addLabel(label) {
    this.appModel.labels.push(label);
  }

  removeLabel(label) {
    const labelIndex = this.appModel.labels.findIndex(
      ({ key, value }) => label.key === key && label.value === value,
    );
    this.appModel.labels.splice(labelIndex, labelIndex >= 0 ? 1 : 0);
  }

  labelKeyExist(label) {
    const { labels } = this.appModel;
    const foundLabel = labels.find(({ key }) => label.key === key);
    return (
      labels.length > 0 && foundLabel !== undefined && label !== foundLabel
    );
  }

  maxLabelsIsReached() {
    return this.appModel.labels.length >= APP_LABELS.MAX_ITEMS;
  }

  canAddNewLabel() {
    return (
      this.appModel.labels.length === 0 ||
      !(this.maxLabelsIsReached() || this.appConfigurationForm.$invalid)
    );
  }

  onAddLabelClick() {
    if (!this.maxLabelsIsReached()) {
      this.addLabel(AppConfigurationController.createLabel());
    }
  }

  onKeyLabelEdit(label, labelId) {
    if (this.labelKeyExist(label)) {
      return this.appConfigurationForm[labelId].$setValidity(
        'duplicateLabelKey',
        false,
      );
    }

    return this.appConfigurationForm[labelId].$setValidity(
      'duplicateLabelKey',
      true,
    );
  }

  onRemoveLabelClick(label) {
    this.removeLabel(label);
  }

  generateName() {
    const splitImage = this.appModel.image.split('/');
    const lastImagePart = splitImage[splitImage.length - 1];
    const splitTag = lastImagePart.split(':');
    const prefix = splitTag[0];
    this.appModel.name = `${prefix}-${nameGenerator()}`;
  }
}
