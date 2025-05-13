export default class AIDashboardAddRegistryCtrl {
  /* @ngInject */
  constructor($translate, atInternet, AiDashboardService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.AiDashboardService = AiDashboardService;
  }

  $onInit() {
    this.loading = false;

    this.registry = {
      region: null,
      username: null,
      password: null,
      url: null,
    };
  }

  addRegistry() {
    this.loading = true;

    return this.AiDashboardService.addRegistry(this.projectId, this.registry)
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_ai_dashboard_registries_add_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          `${this.$translate.instant(
            'pci_projects_project_ai_dashboard_registries_add_error',
          )}: ${error.data.message || error}`,
          'error',
        ),
      )
      .finally(() => {
        this.loading = false;
      });
  }
}
