import {
  DESCRIPTION_MAX,
  NAME_PATTERN,
  SIZE_MIN,
  PREFIX_TRACKING_DASHBOARD_PARTITION_CREATE,
} from '../partition.constants';

export default class NashaComponentsPartitionCreateController {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;

    this.namePattern = NAME_PATTERN;
    this.descriptionMax = DESCRIPTION_MAX;
    this.sizeMin = SIZE_MIN;
    this.model = {
      partitionDescription: null,
      partitionName: null,
      size: null,
      protocol: null,
    };
  }

  $onInit() {
    if (!this.canCreatePartitions) {
      this.close({
        error: this.$translate.instant(
          'nasha_components_partition_create_error_max',
        ),
      });
      return;
    }

    this.sizeMax = this.nasha.zpoolSize;
    this.partitionNames.sort();
  }

  submit() {
    this.trackClick(
      PREFIX_TRACKING_DASHBOARD_PARTITION_CREATE,
      `confirm_${this.model.protocol}`,
    );
    return this.$http
      .post(`${this.nashaApiUrl}/partition`, this.model)
      .then(({ data: task }) =>
        this.close({
          tasks: [task],
          partitionName: this.model.partitionName,
        }),
      )
      .catch((error) => this.close({ error }));
  }

  onCancelClick() {
    this.trackClick(PREFIX_TRACKING_DASHBOARD_PARTITION_CREATE, 'cancel');
    return this.close();
  }
}
