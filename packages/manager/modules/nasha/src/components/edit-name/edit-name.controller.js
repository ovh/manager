import { NAME_PATTERN } from './edit-name.constants';

export default class NashaComponentsEditNameController {
  /* @ngInject */
  constructor($translate, $http) {
    this.$translate = $translate;
    this.$http = $http;
    this.model = { customName: '' };
    this.namePattern = NAME_PATTERN;
  }

  $onInit() {
    this.model.customName = this.nasha.customName;
  }

  submit() {
    return this.$http
      .put(this.nashaApiUrl, this.model)
      .then(() =>
        this.close({
          success: this.$translate.instant(
            'nasha_components_edit_name_success',
          ),
        }),
      )
      .catch((error) => this.close({ error }));
  }
}
