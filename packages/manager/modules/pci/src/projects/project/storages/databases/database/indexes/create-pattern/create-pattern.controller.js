import get from 'lodash/get';
import { CREATE_PATTERN_FORM_RULES } from './create-pattern.constants';

export default class {
  /* @ngInject */
  constructor(DatabaseService) {
    this.DatabaseService = DatabaseService;
    this.formRules = CREATE_PATTERN_FORM_RULES;
  }

  $onInit() {
    this.trackDashboard('indexes::create_pattern', 'page');
  }

  cancel() {
    this.trackDashboard('indexes::create_pattern_cancel');
    this.goBack();
  }

  addPattern() {
    this.processing = true;
    this.trackDashboard('indexes::create_pattern_validate');
    return this.DatabaseService.addPattern(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.model,
    )
      .then((database) =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_databases_create_database_success_message',
            {
              database,
            },
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_databases_create_database_error_message',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      );
  }
}
