import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor(DatabaseService) {
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDashboard('indexes::delete_index', 'page');
  }

  cancel() {
    this.goBack();
  }

  deleteIndex() {
    this.processing = true;
    this.trackDashboard('indexes::delete_index_validate');
    return this.DatabaseService.deleteIndex(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.index.id,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_indexes_delete_index_success_message',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_indexes_delete_index_error_message',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      );
  }
}
