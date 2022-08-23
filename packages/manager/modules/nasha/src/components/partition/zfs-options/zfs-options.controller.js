import isEqual from 'lodash/isEqual';

import { prepareZfsOptions, exportZfsOptions } from '../../../nasha.utils';
import { TRANSLATE_PREFIX } from './zfs-options.constants';
import { PREFIX_TRACKING_DASHBOARD_PARTITION_ZFS_OPTION } from '../partition.constants';

export default class NashaComponentsPartitionZfsOptionsController {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;

    this.isLoading = true;
    this.baseModel = null;
    this.model = {
      atime: null,
      recordsize: null,
      sync: null,
    };
  }

  $onInit() {
    this.$http
      .get(`${this.partitionApiUrl}/options`)
      .then(({ data }) => {
        const options = prepareZfsOptions(data);
        this.model = { ...options };
        this.baseModel = { ...options };
      })
      .catch((error) => {
        if (error.status === 404) {
          const options = prepareZfsOptions();
          this.model = { ...options };
          this.baseModel = { ...options };
        } else {
          this.close({ error });
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  get canSubmit() {
    return !isEqual(this.model, this.baseModel);
  }

  get exportedModel() {
    return exportZfsOptions(this.model);
  }

  getRecordsizeLabel(recordsize) {
    return recordsize.default
      ? `${recordsize.label} ${this.translate('default')}`
      : recordsize.label;
  }

  submit() {
    this.trackClick(PREFIX_TRACKING_DASHBOARD_PARTITION_ZFS_OPTION, 'confirm');
    return this.$http
      .post(`${this.partitionApiUrl}/options`, this.exportedModel)
      .then(({ data: task }) =>
        this.close({
          tasks: [task],
          partitionName: this.partition.partitionName,
          trackingData: {
            prefix: PREFIX_TRACKING_DASHBOARD_PARTITION_ZFS_OPTION,
            hit: 'close',
          },
        }),
      )
      .catch((error) => this.close({ error }));
  }

  onCancelClick() {
    this.trackClick(PREFIX_TRACKING_DASHBOARD_PARTITION_ZFS_OPTION, 'cancel');
    return this.close();
  }

  translate(key, values) {
    return this.$translate.instant(`${TRANSLATE_PREFIX}_${key}`, values);
  }
}
