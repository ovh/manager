import { TRANSLATE_PREFIX } from './create.constants';
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

  get forbidOthersMessage() {
    if (this.partitionNames.length === 1) {
      return this.translate('forbid_one', { name: this.partitionNames[0] });
    }

    return this.translate('forbid_many', {
      names: this.partitionNames.join(', '),
    });
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

  translate(key, values) {
    return this.$translate.instant(`${TRANSLATE_PREFIX}_${key}`, values);
  }
}
