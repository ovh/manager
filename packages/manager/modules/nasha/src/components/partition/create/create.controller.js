import {
  DESCRIPTION_MAX,
  NAME_PATTERN,
  SIZE_MIN,
} from '../partition.constants';

export default class NashaComponentsPartitionCreateController {
  /* @ngInject */
  constructor($translate, $http) {
    this.$translate = $translate;
    this.$http = $http;

    this.protocolEnum = [];
    this.namePattern = NAME_PATTERN;
    this.descriptionMax = DESCRIPTION_MAX;
    this.sizeMin = SIZE_MIN;
    this.model = {
      partitionName: null,
      size: null,
      protocol: null,
    };
  }

  $onInit() {
    this.sizeMax = this.nasha.zpoolSize;
  }

  submit() {
    this.$http
      .post(`${this.nashaApiUrl}/partition`, this.model)
      .catch((error) => this.close({ error }))
      .then(() =>
        this.close({
          success: this.$translate.instant(
            'nasha_components_partition_create_success',
            this.model,
          ),
        }),
      );
  }
}
