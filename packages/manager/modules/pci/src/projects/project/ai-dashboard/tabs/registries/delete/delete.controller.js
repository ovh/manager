export default class AiDashboardRegistriesDeleteCtrl {
  /* @ngInject */
  constructor($translate, atInternet, AiDashboardService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.AiDashboardService = AiDashboardService;
  }

  $onInit() {
    this.loading = false;
  }

  deleteRegistryConfirm() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::ai-dashboard::registries::delete::confirm',
      type: 'action',
    });

    this.loading = true;

    return this.AiDashboardService.deleteRegistry(
      this.projectId,
      this.registryId,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_ai_dashboard_registries_delete_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          `${this.$translate.instant(
            'pci_projects_project_ai_dashboard_registries_delete_error',
          )}: ${error.data.message || error}`,
          'error',
        ),
      )
      .finally(() => {
        this.loading = false;
      });
  }
}
