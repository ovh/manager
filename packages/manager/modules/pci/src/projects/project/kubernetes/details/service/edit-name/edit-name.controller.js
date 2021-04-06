import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, OvhApiCloudProjectKube) {
    this.$translate = $translate;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
  }

  $onInit() {
    this.isEditing = false;

    this.name = this.cluster.name;
  }

  edit() {
    this.sendKubeTrack('details::service::name::confirm');

    this.isEditing = true;
    return this.OvhApiCloudProjectKube.v6()
      .update(
        {
          serviceName: this.projectId,
          kubeId: this.kubeId,
        },
        {
          name: this.name,
        },
      )
      .$promise.then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_kubernetes_details_service_name_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_kubernetes_details_service_name_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }

  onRenameModalCancel() {
    this.sendKubeTrack('details::service::name::cancel');
    this.goBack();
  }
}
