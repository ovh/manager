import { DESCRIPTION_MAX } from '../partition.constants';

export default class NashaComponentsPartitionEditDescriptionController {
  /* @ngInject */
  constructor($translate, $http) {
    this.$translate = $translate;
    this.$http = $http;
    this.model = { description: '' };
    this.descriptionMax = DESCRIPTION_MAX;
  }

  $onInit() {
    this.model.description = this.partition.description;
  }

  submit() {
    const { description } = this.model;
    const { serviceName } = this.nasha;
    const { partitionName } = this.partition;

    this.$http
      .put(`/dedicated/nasha/${serviceName}/partition/${partitionName}`, {
        description,
      })
      .then(() =>
        this.close({
          success: this.$translate.instant(
            'nasha_components_partition_edit_description_success',
          ),
        }),
      )
      .catch((error) => this.close({ error }));
  }
}
