export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDashboard('connector-config', 'page');
    this.model = {};
  }

  getModelValue() {
    const configuration = {};
    Object.keys(this.model).forEach((field) => {
      if (![null, undefined, ''].includes(this.model[field])) {
        configuration[field] = `${this.model[field]}`;
      }
    });
    return {
      configuration,
      name: this.model.name,
      connectorId: this.availableConnector.id,
    };
  }

  addConnector() {
    return this.DatabaseService.postConnector(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.getModelValue(),
    );
    // .then(() =>
    //     this.goBack({
    //       textHtml: this.$translate.instant(
    //         'pci_databases_replications_edit_success_message',
    //       ),
    //     }),
    //   )
    //   .catch((err) =>
    //     this.goBack(
    //       this.$translate.instant(
    //         'pci_databases_replications_edit_error_message',
    //         {
    //           message: err.data?.message || null,
    //         },
    //       ),
    //       'error',
    //     ),
    //   );
  }
}
