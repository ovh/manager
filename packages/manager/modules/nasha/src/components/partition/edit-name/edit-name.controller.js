import { NAME_PATTERN } from '../partition.constants';
import { TRANSLATE } from './edit-name.constants';

export default class NashaComponentsEditNameController {
  /* @ngInject */
  constructor($translate, $http) {
    this.$translate = $translate;
    this.$http = $http;
    this.model = { partitionName: '' };
    this.namePattern = NAME_PATTERN;
    this.partitionNames = [];
  }

  $onInit() {
    const { partitionName } = this.partition;
    this.model.partitionName = partitionName;
    this.partitionNames = this.partitions
      .filter((partition) => partition.partitionName !== partitionName)
      .map((partition) => partition.partitionName);
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
    const { serviceName } = this.nasha;
    const { partitionName } = this.partition;

    return this.$http
      .put(
        `/dedicated/nasha/${serviceName}/partition/${partitionName}`,
        this.model,
      )
      .then(() => this.close({ success: this.translate('success') }))
      .catch((error) => this.close({ error }));
  }

  translate(key, values) {
    return this.$translate.instant(`${TRANSLATE}_${key}`, values);
  }
}
