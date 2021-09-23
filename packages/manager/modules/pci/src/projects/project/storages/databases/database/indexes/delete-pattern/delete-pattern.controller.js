import get from 'lodash/get';
import capitalize from 'lodash/capitalize';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.capitalize = capitalize;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDashboard('indexes::delete_pattern', 'page');
  }

  cancel() {
    this.goBack();
  }

  deleteIndex() {
    this.processing = true;
    this.trackDashboard('indexes::delete_pattern_validate');
    return this.DatabaseService.deletePattern(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.pattern.id,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_indexes_delete_pattern_success_message',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_indexes_delete_pattern_error_message',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      );
  }
}
