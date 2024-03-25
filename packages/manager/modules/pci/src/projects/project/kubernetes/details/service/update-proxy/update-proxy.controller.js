export default class {
  /* @ngInject */
  constructor($translate, Kubernetes) {
    this.$translate = $translate;
    this.Kubernetes = Kubernetes;

    this.form = null;
    this.model = null;
    this.isSubmitting = false;
  }

  $onInit() {
    const { kubeProxyMode: mode, customization } = this.cluster;
    const values = customization?.kubeProxy?.[mode] || {};

    this.model = mode && Object.values(values).length ? { mode, values } : null;
  }

  get canSubmit() {
    return this.form?.$valid || false;
  }

  submit() {
    const prefix =
      'pci_projects_project_kubernetes_details_service_update_proxy';
    this.isSubmitting = true;
    return this.Kubernetes.updateProxy(
      this.projectId,
      this.kubeId,
      this.model.mode,
      this.model.values,
    )
      .then(() => this.goBack(this.$translate.instant(`${prefix}_success`)))
      .catch((error) =>
        this.goBack(
          this.$translate.instant(`${prefix}_error`, {
            message: error.data?.message || error.message,
          }),
          'error',
        ),
      );
  }
}
