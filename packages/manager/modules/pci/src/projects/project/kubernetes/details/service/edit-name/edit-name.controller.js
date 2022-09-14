import get from 'lodash/get';
import { NAME_INPUT_CONSTRAINTS } from '../../../kubernetes.constants';

export default class {
  /* @ngInject */
  constructor($translate, OvhApiCloudProjectKube) {
    this.$translate = $translate;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.inputConstraints = NAME_INPUT_CONSTRAINTS;
  }

  $onInit() {
    this.isEditing = false;
    this.name = this.cluster && this.cluster.name;
  }

  isEditDisabled() {
    return !(this.name && this.name.match(this.inputConstraints.PATTERN));
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
