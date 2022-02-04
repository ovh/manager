import Namespace from '../../../../../../../components/project/storages/databases/namespace.class';
import { FORM_RULES } from '../add/add.constants';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.FORM_RULES = FORM_RULES;
  }

  $onInit() {
    this.trackDashboard('namespace::modify', 'page');
    this.model = this.namespace;
  }

  prepareModel() {
    return new Namespace(this.model);
  }

  edit() {
    this.processing = true;
    this.trackDashboard('namespace::modify_confirm');
    return this.DatabaseService.editNamespace(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.prepareModel(),
    )
      .then(() => {
        this.trackDashboard('namespace::modify_validated');
        return this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_namespaces_edit_success_message',
          ),
        });
      })
      .catch((err) => {
        this.trackDashboard('namespaces::modify_error');
        return this.goBack(
          this.$translate.instant(
            'pci_databases_namespaces_edit_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'error',
        );
      });
  }
}
