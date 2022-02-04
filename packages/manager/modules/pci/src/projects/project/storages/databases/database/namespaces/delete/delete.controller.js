export default class DeleteNamespaceCtrl {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.DatabaseService = DatabaseService;
    this.$translate = $translate;
  }

  $onInit() {
    this.trackDashboard('namespaces::actions_menu::delete_namespace', 'page');
  }

  cancel() {
    this.trackDashboard('namespaces::actions_menu::delete_namespace_cancel');
    this.goBack();
  }

  deleteNamespace() {
    this.processing = true;
    this.trackDashboard('namespaces::actions_menu::delete_namespace_confirm');
    return this.DatabaseService.deleteNamespace(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.namespace.id,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_namespaces_delete_namespace_success_message',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_namespaces_delete_namespace_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'error',
        ),
      );
  }
}
