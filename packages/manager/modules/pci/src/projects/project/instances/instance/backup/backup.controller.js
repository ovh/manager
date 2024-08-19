import get from 'lodash/get';

import { FLAVORS_TYPE } from './backup.contants';

export default class PciInstanceBackupController {
  /* @ngInject */
  constructor(
    $filter,
    $translate,
    CucCloudMessage,
    PciProjectsProjectInstanceService,
    atInternet,
  ) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.atInternet = atInternet;
    this.FLAVORS_TYPE = FLAVORS_TYPE;
  }

  $onInit() {
    this.backup = {
      name: `${this.instance.name} ${this.$filter('date')(
        new Date(),
        'short',
      )}`,
    };
    this.isLoading = false;
  }

  createBackup() {
    this.isLoading = true;
    this.trackBackupCreate();

    return this.PciProjectsProjectInstanceService.createBackup(
      this.projectId,
      this.instance,
      this.backup,
    )
      .then(() => {
        this.atInternet.trackPage({
          name: `PublicCloud::compute::instances::instances::banner-info::create_instances-backup_pending::${this.instance.flavor?.name}_${this.instance.region}`,
          type: 'navigation',
        });
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_backup_success_message',
            {
              backup: this.backup.name,
            },
          ),
        );
      })

      .catch((err) => {
        this.atInternet.trackPage({
          name: `PublicCloud::compute::instances::instances::banner-error:create_instances-backup_error::${this.instance.flavor?.name}_${this.instance.region}`,
          type: 'navigation',
        });
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_backup_error_backup',
            {
              message: get(err, 'data.message', null),
              backup: this.backup.name,
            },
          ),
          'error',
        );
      })

      .finally(() => {
        this.atInternet.trackPage({
          name: `PublicCloud::compute::instances::instances::banner-info::create_instances-backup_success::${this.instance.flavor?.name}_${this.instance.region}`,
          type: 'navigation',
        });
        this.isLoading = false;
      });
  }

  trackBackupCreate() {
    this.atInternet.trackClick({
      name: `PublicCloud::compute::instances::pop-up::button::create_instances-backup::confirm::${this.instance.flavor?.name}_${this.instance.region}`,
      type: 'action',
    });
  }
}
