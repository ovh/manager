import {
  DESCRIPTION_MAX,
  NAME_PATTERN,
  SIZE_MIN,
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
    this.sizeMax = this.nasha.zpoolSize;
    this.partitionNames.sort();
  }

  submit() {
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
}
