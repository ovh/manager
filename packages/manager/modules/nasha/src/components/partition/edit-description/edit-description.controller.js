import {
  DESCRIPTION_MAX,
  PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_DESCRIPTION,
} from '../partition.constants';

export default class NashaComponentsPartitionEditDescriptionController {
  /* @ngInject */
  constructor($translate, $http) {
    this.$translate = $translate;
    this.$http = $http;
    this.model = { partitionDescription: '' };
    this.descriptionMax = DESCRIPTION_MAX;
  }

  $onInit() {
    this.model.partitionDescription = this.partition.partitionDescription;
  }

  submit() {
    this.trackClick(
      PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_DESCRIPTION,
      'confirm',
    );
    return this.$http
      .put(this.partitionApiUrl, this.model)
      .then(() =>
        this.close({
          success: this.$translate.instant(
            'nasha_components_partition_edit_description_success',
          ),
        }),
      )
      .catch((error) => this.close({ error }));
  }

  onCancelClick() {
    this.trackClick(
      PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_DESCRIPTION,
      'cancel',
    );
    return this.close();
  }
}
