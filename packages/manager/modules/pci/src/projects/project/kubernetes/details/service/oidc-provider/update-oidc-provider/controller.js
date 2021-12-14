export default class {
  /* @ngInject */
  constructor($translate, Kubernetes) {
    this.$translate = $translate;
    this.Kubernetes = Kubernetes;
  }

  $onInit() {
    this.isUpdating = false;
  }

  onUpdateOidcProviderConfirm() {
    this.sendKubeTrack('details::service::update-oidc-provider::confirm');

    this.isUpdating = true;
    return this.Kubernetes.updateOidcProvider(
      this.projectId,
      this.kubeId,
      this.oidcProviderModel,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_kubernetes_details_service_update_oidc_provider_request_success',
          ),
        ),
      )
      .catch(({ data: error }) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_kubernetes_details_service_update_oidc_provider_request_error',
            {
              message: error.message || error,
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isUpdating = false;
      });
  }

  onUpdateOidcProviderCancel() {
    this.sendKubeTrack('details::service::update-oidc-provider::cancel');

    return this.goBack();
  }
}
