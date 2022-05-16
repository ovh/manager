import isEqual from 'lodash/isEqual';
import { TRANSLATE } from './zfs-options.constants';

export default class NashaComponentsPartitionZfsOptionsController {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;

    this.recordsizeEnum = [];
    this.syncEnum = [];
    this.baseModel = null;
    this.model = {
      atime: null,
      recordsize: null,
      sync: null,
    };
  }

  $onInit() {
    this.model = { ...this.options };
    this.baseModel = { ...this.options };
  }

  get canSubmit() {
    return !isEqual(this.model, this.baseModel);
  }

  get exportedModel() {
    return this.exportZfsOptions(this.model);
  }

  getRecordsizeLabel(recordsize) {
    return recordsize.default
      ? `${recordsize.label} ${this.translate('default')}`
      : recordsize.label;
  }

  submit() {
    this.$http
      .post(`${this.partitionApiUrl}/options`, this.exportedModel)
      .catch((error) => this.close({ error }))
      .then(() =>
        this.close({
          success: this.translate('success', this.partition),
        }),
      );
  }

  translate(key, values) {
    return this.$translate.instant(`${TRANSLATE}_${key}`, values);
  }
}
