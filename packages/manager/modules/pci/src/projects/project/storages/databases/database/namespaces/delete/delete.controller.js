export default class DeleteNamespaceCtrl {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.DatabaseService = DatabaseService;
    this.$translate = $translate;
  }

  $onInit() {
    this.trackDashboard('namespaces_delete', 'page');
  }

  cancel() {
    this.trackDashboard('namespaces::delete_namespace_cancel');
    this.goBack();
  }

  deleteNamespace() {
    this.processing = true;
    this.trackDashboard('namespaces::delete_namespace_validate');
    return this.DatabaseService.deleteNamespace(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.namespace.id,
    )
      .then(() => {
        this.trackDashboard(
          'namespaces::namespaces_delete_validate_banner',
          'page',
        );
        return this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_namespaces_delete_namespace_success_message',
          ),
        });
      })
      .catch((err) => {
        this.trackDashboard(
          'namespaces::namespaces_delete_error_banner',
          'page',
        );
        return this.goBack(
          this.$translate.instant(
            'pci_databases_namespaces_delete_namespace_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'error',
        );
      });
  }
}
