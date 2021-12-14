export default class {
  /* @ngInject */
  constructor($translate, Kubernetes) {
    this.$translate = $translate;
    this.Kubernetes = Kubernetes;
  }

  $onInit() {
    this.isAdding = false;
  }

  onAddOidcProviderConfirm() {
    this.sendKubeTrack('details::service::add-oidc-provider::confirm');

    this.isAdding = true;
    return this.Kubernetes.addOidcProvider(
      this.projectId,
      this.kubeId,
      this.oidcProviderModel,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_kubernetes_details_service_add_oidc_provider_request_success',
          ),
        ),
      )
      .catch(({ data: error }) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_kubernetes_details_service_add_oidc_provider_request_error',
            {
              message: error.message || error,
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isAdding = false;
      });
  }

  onAddOidcProviderCancel() {
    this.sendKubeTrack('details::service::add-oidc-provider::cancel');

    return this.goBack();
  }
}
