export default class {
  /* @ngInject */
  constructor($translate, AnthosTenantsService) {
    this.$translate = $translate;
    this.AnthosTenantsService = AnthosTenantsService;
  }

  addStorage() {
    this.isAdding = true;

    this.AnthosTenantsService.addStorage(
      this.serviceName,
      this.storageDescription,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant('anthos_dashboard_add_storage_success'),
        ),
      )
      .catch((error) => {
        this.goBack(
          this.$translate.instant('anthos_dashboard_add_storage_error', {
            message: error.data?.message,
          }),
          'error',
        );
      })
      .finally(() => {
        this.isAdding = false;
      });
  }
}
