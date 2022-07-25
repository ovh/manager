import isEqual from 'lodash/isEqual';

import { TRANSLATE } from './zfs-options.constants';

export default class NashaComponentsPartitionZfsOptionsController {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;

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
    return this.$http
      .post(`${this.partitionApiUrl}/options`, this.exportedModel)
      .then(({ data: task }) =>
        this.close({
          tasks: [task],
          partitionName: this.partition.partitionName,
        }),
      )
      .catch((error) => this.close({ error }));
  }

  translate(key, values) {
    return this.$translate.instant(`${TRANSLATE}_${key}`, values);
  }
}
