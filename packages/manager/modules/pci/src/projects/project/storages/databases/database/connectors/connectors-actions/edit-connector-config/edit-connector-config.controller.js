export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDashboard('connector-config', 'page');
    this.model = {
      name: this.connector.name,
      ...this.connector.configuration,
    };
  }

  getModelValue() {
    const configuration = {};
    Object.keys(this.model).forEach((field) => {
      if (![null, undefined, ''].includes(this.model[field])) {
        configuration[field] = `${this.model[field]}`;
      }
    });
    return { configuration };
  }

  updateConnector() {
    return this.DatabaseService.putConnector(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.connector.id,
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
