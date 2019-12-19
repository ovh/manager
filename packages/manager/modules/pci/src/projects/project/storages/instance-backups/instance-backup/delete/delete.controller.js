import get from 'lodash/get';
import map from 'lodash/map';

export default class PciBlockStorageDetailsDeleteController {
  /* @ngInject */
  constructor(
    $translate,
    PciProjectStorageInstanceBackupService,
  ) {
    this.$translate = $translate;
    this.PciProjectStorageInstanceBackupService = PciProjectStorageInstanceBackupService;
  }

  $onInit() {
    this.isLoading = true;
    return this.PciProjectStorageInstanceBackupService
      .getAssociatedInstances(this.projectId, this.instanceBackup)
      .then((instances) => {
        this.namesOfAssociatedInstances = map(instances, 'name');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  deleteStorage() {
    this.isLoading = true;
    return this.PciProjectStorageInstanceBackupService
      .delete(this.projectId, this.instanceBackup)
      .then(() => this.goBack(
        this.$translate.instant(
          'pci_projects_project_storages_volume-instances_volume-instance_delete_success_message',
          {
            backup: this.instanceBackup.name,
          },
        ),
      ))
      .catch((err) => this.goBack(this.$translate.instant(
        'pci_projects_project_storages_volume-instances_volume-instance_delete_error_delete',
        {
          message: get(err, 'data.message', null),
          backup: this.instanceBackup.name,
        },
      ), 'error'))
      .finally(() => {
        this.isLoading = false;
      });
  }
}
