import { NAME_PATTERN } from '../partition.constants';
import { TRANSLATE } from './edit-name.constants';

export default class NashaComponentsEditNameController {
  /* @ngInject */
  constructor($translate, $http) {
    this.$translate = $translate;
    this.$http = $http;
    this.model = { partitionName: '' };
    this.namePattern = NAME_PATTERN;
  }

  $onInit() {
    this.model.partitionName = this.partition.partitionName;
    this.partitionNames = this.partitionNames
      .filter((partitionName) => partitionName !== this.partition.partitionName)
      .sort();
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
      .put(this.partitionApiUrl, this.model)
      .then(() => this.close({ success: this.translate('success') }))
      .catch((error) => this.close({ error }));
  }

  translate(key, values) {
    return this.$translate.instant(`${TRANSLATE}_${key}`, values);
  }
}
