import {
  APP_LABELS,
  APP_PRIVACY_SETTINGS,
  APP_PROBE,
} from '../../add.constants';
import { nameGenerator } from '../../../../../../../name-generator.constant';
import { APP_LABELS_INFO } from '../../../app.constants';

export default class AppConfigurationController {
  static createLabel(key = null, value = null) {
    return { key, value };
  }

  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
    this.APP_LABELS = APP_LABELS;
    this.APP_PRIVACY_SETTINGS = APP_PRIVACY_SETTINGS;
    this.APP_PROBE = APP_PROBE;
  }

  $onInit() {
    this.generateName();
  }

  getLabelsInfoLink() {
    return (
      APP_LABELS_INFO[this.coreConfig.getUser().ovhSubsidiary] ||
      APP_LABELS_INFO.DEFAULT
    );
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
